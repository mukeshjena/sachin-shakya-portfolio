// presentation/hero/scene/BlackholeHero.scene.ts
// Pure WebGL2/WebGL1 multi-pass raymarching engine for relativistic blackhole accretion disk.
// Universal Separation of Concerns (Rule 13) — Zero React dependencies or hooks.

import {
  BLACKHOLE_FRAGMENT_SHADER,
  BLOOM_BLUR_SHADER,
  BLOOM_EXTRACT_SHADER,
  COMPOSITE_SHADER,
  TEMPORAL_BLEND_SHADER,
  VERTEX_SHADER,
} from "./BlackholeHero.shaders";
import type { BlackholeEngineConfig, ProgramInfo, RenderTarget } from "./BlackholeHero.utils";
import {
  computeCameraBasis,
  createQuadBuffer,
  DEFAULT_BLACKHOLE_CONFIG,
  DEG_TO_RAD,
  dropTargets,
  executeBloomPass,
  getScrimDirectionCode,
  hexToLinear,
  JITTER_SAMPLES,
  linkProgram,
  makeTarget,
  setupPrecisionBuffers,
} from "./BlackholeHero.utils";

export type { BlackholeEngineConfig };
export { DEFAULT_BLACKHOLE_CONFIG };

export class BlackholeSceneController {
  private canvas: HTMLCanvasElement | null = null;
  private container: HTMLElement | null = null;
  private gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  private config: BlackholeEngineConfig = { ...DEFAULT_BLACKHOLE_CONFIG };

  private isReducedMotion = false;
  private isSoftwareRenderer = false;
  private isWebGL2 = false;
  private hasHalfFloat = true;
  private texType = 0;
  private texFormat = 0;
  private filterMode = 0;
  private packFactor = 1;

  private quadBuffer: WebGLBuffer | null = null;
  private marchProg: ProgramInfo | null = null;
  private blendProg: ProgramInfo | null = null;
  private extractProg: ProgramInfo | null = null;
  private blurProg: ProgramInfo | null = null;
  private compositeProg: ProgramInfo | null = null;

  private targetScene: RenderTarget | null = null;
  private targetPrev: RenderTarget | null = null;
  private targetBlend: RenderTarget | null = null;
  private targetBlurA: RenderTarget | null = null;
  private targetBlurB: RenderTarget | null = null;

  private frameIndex = 0;
  private viewWidth = 0;
  private viewHeight = 0;
  private renderWidth = 0;
  private renderHeight = 0;

  private simTime = 0;
  private lastTimestamp = 0;
  private isRunning = true;
  private isIntersecting = true;
  private animFrameId = 0;

  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  init(
    canvas: HTMLCanvasElement,
    container: HTMLElement,
    options: Partial<BlackholeEngineConfig> = {}
  ): boolean {
    this.canvas = canvas;
    this.container = container;
    this.config = { ...DEFAULT_BLACKHOLE_CONFIG, ...options };

    this.isReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (this.isReducedMotion) {
      this.simTime = 6;
    }

    const ctxOpts: WebGLContextAttributes = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    };

    this.gl =
      (canvas.getContext("webgl2", ctxOpts) as WebGL2RenderingContext | null) ||
      (canvas.getContext("webgl", ctxOpts) as WebGLRenderingContext | null);

    if (!this.gl) {
      container.dataset.webgl = "unsupported";
      canvas.style.display = "none";
      return false;
    }

    const gl = this.gl;
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const unmasked = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "")
      : "";
    this.isSoftwareRenderer = /swiftshader|llvmpipe|softpipe|software|microsoft basic/i.test(
      unmasked
    );
    this.isWebGL2 =
      typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;

    this.setupPrecisionBuffers();
    if (!this.buildShadersAndGeometry()) {
      container.dataset.webgl = "build-failed";
      canvas.style.display = "none";
      return false;
    }

    this.handleResize();
    this.settle(this.isReducedMotion ? 16 : 1);

    if (!this.isReducedMotion) {
      this.animFrameId = requestAnimationFrame(this.renderLoop);
    }

    this.attachObservers();
    return true;
  }

  private setupPrecisionBuffers(): void {
    const gl = this.gl;
    if (!gl) return;
    const bufConfig = setupPrecisionBuffers(gl, this.isWebGL2);
    this.hasHalfFloat = bufConfig.hasHalfFloat;
    this.texType = bufConfig.texType;
    this.texFormat = bufConfig.texFormat;
    this.filterMode = bufConfig.filterMode;
    this.packFactor = bufConfig.packFactor;
  }

  private dropTargets(): void {
    const gl = this.gl;
    if (!gl) return;
    dropTargets(gl, [
      this.targetScene,
      this.targetPrev,
      this.targetBlend,
      this.targetBlurA,
      this.targetBlurB,
    ]);
    this.targetScene = null;
    this.targetPrev = null;
    this.targetBlend = null;
    this.targetBlurA = null;
    this.targetBlurB = null;
    this.frameIndex = 0;
  }

  private buildShadersAndGeometry(): boolean {
    const gl = this.gl;
    if (!gl) return false;

    this.marchProg = linkProgram(gl, VERTEX_SHADER, BLACKHOLE_FRAGMENT_SHADER);
    this.blendProg = linkProgram(gl, VERTEX_SHADER, TEMPORAL_BLEND_SHADER);
    this.extractProg = linkProgram(gl, VERTEX_SHADER, BLOOM_EXTRACT_SHADER);
    this.blurProg = linkProgram(gl, VERTEX_SHADER, BLOOM_BLUR_SHADER);
    this.compositeProg = linkProgram(gl, VERTEX_SHADER, COMPOSITE_SHADER);

    if (
      !this.marchProg ||
      !this.blendProg ||
      !this.extractProg ||
      !this.blurProg ||
      !this.compositeProg
    ) {
      return false;
    }

    this.quadBuffer = createQuadBuffer(gl);
    return Boolean(this.quadBuffer);
  }

  private handleResize(): void {
    const container = this.container;
    const canvas = this.canvas;
    const gl = this.gl;
    if (!container || !canvas || !gl) return;

    const rect = container.getBoundingClientRect();
    const dpr = this.isSoftwareRenderer
      ? 1
      : Math.min(window.devicePixelRatio || 1, Math.max(1, this.config.maxDpr));

    const cssW = Math.max(1, Math.round(rect.width));
    const cssH = Math.max(1, Math.round(rect.height));
    const resScale = this.isSoftwareRenderer
      ? 0.34
      : Math.min(1, Math.max(0.4, this.config.resolution));

    const physW = Math.max(2, Math.round(cssW * dpr));
    const physH = Math.max(2, Math.round(cssH * dpr));
    const rendW = Math.max(2, Math.round(physW * resScale));
    const rendH = Math.max(2, Math.round(physH * resScale));

    if (
      physW === this.viewWidth &&
      physH === this.viewHeight &&
      rendW === this.renderWidth &&
      rendH === this.renderHeight
    ) {
      return;
    }

    this.viewWidth = physW;
    this.viewHeight = physH;
    this.renderWidth = rendW;
    this.renderHeight = rendH;

    canvas.width = physW;
    canvas.height = physH;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    this.dropTargets();
    this.targetScene = makeTarget(gl, rendW, rendH, this.texFormat, this.texType, this.filterMode);
    this.targetPrev = makeTarget(gl, rendW, rendH, this.texFormat, this.texType, this.filterMode);
    this.targetBlend = makeTarget(gl, rendW, rendH, this.texFormat, this.texType, this.filterMode);

    const blurW = Math.max(2, rendW >> 2);
    const blurH = Math.max(2, rendH >> 2);
    this.targetBlurA = makeTarget(gl, blurW, blurH, this.texFormat, this.texType, this.filterMode);
    this.targetBlurB = makeTarget(gl, blurW, blurH, this.texFormat, this.texType, this.filterMode);
  }

  private applyProgram(prog: WebGLProgram): void {
    // biome-ignore lint/correctness/useHookAtTopLevel: Native WebGL method, not a React hook
    this.gl?.useProgram(prog);
  }

  private settle(frames: number): void {
    for (let i = 0; i < frames; i++) {
      this.renderFrame(this.simTime);
    }
  }

  private renderFrame(timeSec: number): void {
    const gl = this.gl;
    if (
      !gl ||
      !this.marchProg ||
      !this.blendProg ||
      !this.extractProg ||
      !this.blurProg ||
      !this.compositeProg ||
      !this.targetScene ||
      !this.targetPrev ||
      !this.targetBlend ||
      !this.targetBlurA ||
      !this.targetBlurB
    ) {
      return;
    }

    const cfg = this.config;
    const dist = Math.max(2.2, cfg.distance);
    const { camPos, fwd, right, up } = computeCameraBasis(cfg, timeSec);

    const hot = hexToLinear(cfg.hotColor);
    const mid = hexToLinear(cfg.midColor);
    const cool = hexToLinear(cfg.coolColor);
    const safeDiskOut = Math.max(cfg.diskInner + 0.5, cfg.diskOuter);

    // 1. Raymarching pass
    this.applyProgram(this.marchProg.program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetScene.fb);
    gl.viewport(0, 0, this.targetScene.w, this.targetScene.h);

    const mu = this.marchProg.u;
    gl.uniform2f(mu.uRes, this.targetScene.w, this.targetScene.h);
    gl.uniform1f(mu.uTime, timeSec);
    gl.uniform3f(mu.uCamPos, camPos[0], camPos[1], camPos[2]);
    gl.uniform3f(mu.uRight, right[0], right[1], right[2]);
    gl.uniform3f(mu.uUp, up[0], up[1], up[2]);
    gl.uniform3f(mu.uFwd, fwd[0], fwd[1], fwd[2]);
    gl.uniform1f(mu.uTanHalf, Math.tan(Math.max(8, Math.min(110, cfg.fov)) * 0.5 * DEG_TO_RAD));
    gl.uniform2f(mu.uFocus, cfg.focus[0], 1 - cfg.focus[1]);
    gl.uniform1f(
      mu.uSteps,
      this.isSoftwareRenderer ? 130 : Math.max(60, Math.min(460, Math.round(cfg.steps)))
    );
    gl.uniform1f(mu.uSkyR, Math.max(dist * 1.35, safeDiskOut * 2.4));
    gl.uniform1f(mu.uDiskIn, Math.max(1.05, cfg.diskInner));
    gl.uniform1f(mu.uDiskOut, safeDiskOut);
    gl.uniform1f(mu.uThick, Math.max(0.02, cfg.diskThickness));
    gl.uniform1f(mu.uDensity, Math.max(0, cfg.diskDensity));
    gl.uniform1f(mu.uSpin, cfg.spinSpeed * Math.PI * 2);
    gl.uniform1f(mu.uGrain, Math.max(0.02, cfg.grain));
    gl.uniform1f(mu.uBright, Math.max(0, cfg.brightness));
    gl.uniform1f(mu.uDoppler, Math.max(0, Math.min(1, cfg.doppler)));
    gl.uniform3f(mu.uHot, hot[0], hot[1], hot[2]);
    gl.uniform3f(mu.uMid, mid[0], mid[1], mid[2]);
    gl.uniform3f(mu.uCool, cool[0], cool[1], cool[2]);
    gl.uniform1f(mu.uStars, Math.max(0, cfg.starBrightness));
    gl.uniform1f(mu.uEncode, this.hasHalfFloat ? 0 : 1);

    const jitter = JITTER_SAMPLES[this.frameIndex % JITTER_SAMPLES.length];
    gl.uniform2f(mu.uJitter, jitter[0] - 0.5, jitter[1] - 0.5);
    gl.uniform1f(mu.uSeed, (this.frameIndex % 64) * 17.13);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 2. Temporal blend pass
    const alpha = this.frameIndex === 0 ? 1 : 0.14;
    this.applyProgram(this.blendProg.program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetBlend.fb);
    gl.viewport(0, 0, this.targetBlend.w, this.targetBlend.h);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.targetScene.tex);
    gl.uniform1i(this.blendProg.u.uCurr, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(
      gl.TEXTURE_2D,
      this.frameIndex === 0 ? this.targetScene.tex : this.targetPrev.tex
    );
    gl.uniform1i(this.blendProg.u.uPrev, 1);
    gl.uniform1f(this.blendProg.u.uAlpha, alpha);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    const tmp = this.targetPrev;
    this.targetPrev = this.targetBlend;
    this.targetBlend = tmp;

    // 3. Bloom passes (extract + blur)
    executeBloomPass(
      gl,
      this.extractProg,
      this.blurProg,
      this.targetPrev,
      this.targetBlurA,
      this.targetBlurB,
      this.packFactor
    );

    // 4. Composite pass
    this.applyProgram(this.compositeProg.program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.viewWidth, this.viewHeight);

    const cu = this.compositeProg.u;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.targetPrev.tex);
    gl.uniform1i(cu.uScene, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.targetBlurA.tex);
    gl.uniform1i(cu.uBloom, 1);

    gl.uniform1f(cu.uGlow, cfg.glow);
    gl.uniform1f(cu.uExposure, cfg.exposure);
    gl.uniform1f(cu.uVignette, cfg.vignette);
    gl.uniform1f(cu.uPackFactor, this.packFactor);
    gl.uniform2f(cu.uRes, this.viewWidth, this.viewHeight);

    const scrimDir = getScrimDirectionCode(cfg.scrim);
    gl.uniform1i(cu.uScrimDir, scrimDir);
    gl.uniform1f(cu.uScrimStr, Math.max(0, Math.min(1, cfg.scrimStrength)));

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.frameIndex++;
  }

  private renderLoop = (timestamp: number): void => {
    if (!this.isRunning || !this.isIntersecting || this.config.paused) {
      this.lastTimestamp = 0;
      return;
    }

    if (this.lastTimestamp === 0) {
      this.lastTimestamp = timestamp;
    }

    const dt = Math.min(0.066, (timestamp - this.lastTimestamp) * 0.001);
    this.lastTimestamp = timestamp;
    this.simTime += dt;

    this.renderFrame(this.simTime);
    this.animFrameId = requestAnimationFrame(this.renderLoop);
  };

  private attachObservers(): void {
    if (typeof ResizeObserver !== "undefined" && this.container) {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this.container);
    }

    if (typeof IntersectionObserver !== "undefined" && this.container) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          this.isIntersecting = entry.isIntersecting;
          if (this.isIntersecting && !this.isReducedMotion && !this.config.paused) {
            this.lastTimestamp = 0;
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = requestAnimationFrame(this.renderLoop);
          }
        },
        { threshold: 0.05 }
      );
      this.intersectionObserver.observe(this.container);
    }
  }

  updateConfig(newConfig: Partial<BlackholeEngineConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  destroy(): void {
    this.dispose();
  }

  dispose(): void {
    this.isRunning = false;
    cancelAnimationFrame(this.animFrameId);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    this.dropTargets();

    const gl = this.gl;
    if (gl) {
      if (this.quadBuffer) gl.deleteBuffer(this.quadBuffer);
      const progs = [
        this.marchProg,
        this.blendProg,
        this.extractProg,
        this.blurProg,
        this.compositeProg,
      ];
      for (const p of progs) {
        if (p) gl.deleteProgram(p.program);
      }
    }
  }
}

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

export interface BlackholeEngineConfig {
  distance: number;
  elevation: number;
  azimuth: number;
  orbitSpeed: number;
  roll: number;
  fov: number;
  diskInner: number;
  diskOuter: number;
  diskThickness: number;
  diskDensity: number;
  brightness: number;
  spinSpeed: number;
  grain: number;
  doppler: number;
  hotColor: string;
  midColor: string;
  coolColor: string;
  starBrightness: number;
  glow: number;
  exposure: number;
  vignette: number;
  steps: number;
  resolution: number;
  maxDpr: number;
  focus: readonly [number, number];
  scrim: "none" | "left" | "right" | "top" | "bottom";
  scrimStrength: number;
  paused: boolean;
}

export const DEFAULT_BLACKHOLE_CONFIG: BlackholeEngineConfig = {
  distance: 24,
  elevation: -5.5,
  azimuth: 0,
  orbitSpeed: 0,
  roll: -20,
  fov: 42,
  diskInner: 3,
  diskOuter: 15,
  diskThickness: 0.26,
  diskDensity: 1,
  brightness: 1,
  spinSpeed: 0.06,
  grain: 0.48,
  doppler: 0.35,
  hotColor: "#FFF3DE",
  midColor: "#FF9838",
  coolColor: "#8E3A0B",
  starBrightness: 0,
  glow: 1,
  exposure: 0.9,
  vignette: 0.28,
  steps: 300,
  resolution: 0.7,
  maxDpr: 1.75,
  focus: [0.72, 0.46],
  scrim: "none",
  scrimStrength: 0.9,
  paused: false,
};

interface ProgramInfo {
  program: WebGLProgram;
  u: Record<string, WebGLUniformLocation | null>;
}

interface RenderTarget {
  fb: WebGLFramebuffer;
  tex: WebGLTexture;
  w: number;
  h: number;
}

const DEG_TO_RAD = Math.PI / 180;
const JITTER_SAMPLES = [
  [0.5, 0.333],
  [0.25, 0.667],
  [0.75, 0.111],
  [0.125, 0.444],
  [0.625, 0.778],
  [0.375, 0.222],
  [0.875, 0.556],
  [0.0625, 0.889],
];

function hexToLinear(hex: string): [number, number, number] {
  const clean = hex.trim().replace("#", "");
  const full =
    clean.length === 3
      ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
      : clean.slice(0, 6);
  const val = Number.parseInt(full, 16);
  return [((val >> 16) & 255) / 255, ((val >> 8) & 255) / 255, (val & 255) / 255].map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  ) as [number, number, number];
}

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

    this.hasHalfFloat = true;
    this.texType = gl.UNSIGNED_BYTE;
    this.texFormat = gl.RGBA;

    if (this.isWebGL2) {
      const gl2 = gl as WebGL2RenderingContext;
      if (
        gl2.getExtension("EXT_color_buffer_half_float") ||
        gl2.getExtension("EXT_color_buffer_float")
      ) {
        this.texType = gl2.HALF_FLOAT;
        this.texFormat = (gl2 as unknown as { RGBA16F: number }).RGBA16F || gl2.RGBA;
      } else {
        this.hasHalfFloat = false;
      }
    } else {
      const extHalf = gl.getExtension("OES_texture_half_float");
      const extColor = gl.getExtension("EXT_color_buffer_half_float");
      if (extHalf && extColor) {
        this.texType = extHalf.HALF_FLOAT_OES;
      } else {
        this.hasHalfFloat = false;
      }
    }

    if (!this.hasHalfFloat) {
      this.texType = gl.UNSIGNED_BYTE;
      this.texFormat = gl.RGBA;
    }

    const hasLinear =
      this.isWebGL2 || !!gl.getExtension("OES_texture_half_float_linear") || !this.hasHalfFloat;
    this.filterMode = hasLinear ? gl.LINEAR : gl.NEAREST;
    this.packFactor = this.hasHalfFloat ? 1 : 0.12;
  }

  private compileShader(type: number, src: string): WebGLShader | null {
    const gl = this.gl;
    if (!gl) return null;
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("[BlackholeEngine] shader failed:", gl.getShaderInfoLog(shader) || "no log");
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  private linkProgram(vertSrc: string, fragSrc: string): ProgramInfo | null {
    const gl = this.gl;
    if (!gl) return null;
    const vert = this.compileShader(gl.VERTEX_SHADER, vertSrc);
    const frag = this.compileShader(gl.FRAGMENT_SHADER, fragSrc);
    if (!vert || !frag) return null;

    const prog = gl.createProgram();
    if (!prog) return null;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.bindAttribLocation(prog, 0, "aPos");
    gl.linkProgram(prog);
    gl.deleteShader(vert);
    gl.deleteShader(frag);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("[BlackholeEngine] link failed:", gl.getProgramInfoLog(prog));
      return null;
    }

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const active = gl.getActiveUniform(prog, i);
      if (active) {
        uniforms[active.name] = gl.getUniformLocation(prog, active.name);
      }
    }
    return { program: prog, u: uniforms };
  }

  private makeTarget(w: number, h: number): RenderTarget | null {
    const gl = this.gl;
    if (!gl) return null;
    const tex = gl.createTexture();
    const fb = gl.createFramebuffer();
    if (!tex || !fb) return null;

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.texFormat, w, h, 0, gl.RGBA, this.texType, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.filterMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.filterMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      gl.deleteTexture(tex);
      gl.deleteFramebuffer(fb);
      return null;
    }
    return { fb, tex, w, h };
  }

  private dropTargets(): void {
    const gl = this.gl;
    if (!gl) return;
    const list = [
      this.targetScene,
      this.targetPrev,
      this.targetBlend,
      this.targetBlurA,
      this.targetBlurB,
    ];
    for (const t of list) {
      if (t) {
        gl.deleteTexture(t.tex);
        gl.deleteFramebuffer(t.fb);
      }
    }
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

    this.marchProg = this.linkProgram(VERTEX_SHADER, BLACKHOLE_FRAGMENT_SHADER);
    this.blendProg = this.linkProgram(VERTEX_SHADER, TEMPORAL_BLEND_SHADER);
    this.extractProg = this.linkProgram(VERTEX_SHADER, BLOOM_EXTRACT_SHADER);
    this.blurProg = this.linkProgram(VERTEX_SHADER, BLOOM_BLUR_SHADER);
    this.compositeProg = this.linkProgram(VERTEX_SHADER, COMPOSITE_SHADER);

    if (
      !this.marchProg ||
      !this.blendProg ||
      !this.extractProg ||
      !this.blurProg ||
      !this.compositeProg
    ) {
      return false;
    }

    this.quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    return true;
  }

  private handleResize(): void {
    const container = this.container;
    const canvas = this.canvas;
    if (!container || !canvas) return;

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
    this.targetScene = this.makeTarget(rendW, rendH);
    this.targetPrev = this.makeTarget(rendW, rendH);
    this.targetBlend = this.makeTarget(rendW, rendH);

    const blurW = Math.max(2, rendW >> 2);
    const blurH = Math.max(2, rendH >> 2);
    this.targetBlurA = this.makeTarget(blurW, blurH);
    this.targetBlurB = this.makeTarget(blurW, blurH);
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
    const radAz = (cfg.azimuth + cfg.orbitSpeed * timeSec) * DEG_TO_RAD;
    const radEl = Math.max(-88, Math.min(88, cfg.elevation)) * DEG_TO_RAD;
    const dist = Math.max(2.2, cfg.distance);

    const cosEl = Math.cos(radEl);
    const camX = dist * cosEl * Math.cos(radAz);
    const camY = dist * Math.sin(radEl);
    const camZ = dist * cosEl * Math.sin(radAz);

    const fwdX = -camX / dist;
    const fwdY = -camY / dist;
    const fwdZ = -camZ / dist;

    let rgtX = fwdZ;
    let rgtY = 0;
    let rgtZ = -fwdX;
    const rgtLen = Math.hypot(rgtX, rgtY, rgtZ) || 1;
    rgtX /= rgtLen;
    rgtY /= rgtLen;
    rgtZ /= rgtLen;

    const upNormX = rgtY * fwdZ - rgtZ * fwdY;
    const upNormY = rgtZ * fwdX - rgtX * fwdZ;
    const upNormZ = rgtX * fwdY - rgtY * fwdX;

    const cosRoll = Math.cos(cfg.roll * DEG_TO_RAD);
    const sinRoll = Math.sin(cfg.roll * DEG_TO_RAD);

    const finalRightX = rgtX * cosRoll + upNormX * sinRoll;
    const finalRightY = rgtY * cosRoll + upNormY * sinRoll;
    const finalRightZ = rgtZ * cosRoll + upNormZ * sinRoll;

    const finalUpX = -rgtX * sinRoll + upNormX * cosRoll;
    const finalUpY = -rgtY * sinRoll + upNormY * cosRoll;
    const finalUpZ = -rgtZ * sinRoll + upNormZ * cosRoll;

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
    gl.uniform3f(mu.uCamPos, camX, camY, camZ);
    gl.uniform3f(mu.uRight, finalRightX, finalRightY, finalRightZ);
    gl.uniform3f(mu.uUp, finalUpX, finalUpY, finalUpZ);
    gl.uniform3f(mu.uFwd, fwdX, fwdY, fwdZ);
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
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.targetPrev.tex);
    gl.uniform1i(this.blendProg.u.uCur, 0);
    gl.uniform1i(this.blendProg.u.uPrev, 1);
    gl.uniform1f(this.blendProg.u.uAlpha, alpha);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Swap blend & previous
    const curResult = this.targetBlend;
    this.targetBlend = this.targetPrev;
    this.targetPrev = curResult;
    this.frameIndex++;

    // 3. Bloom extraction pass
    this.applyProgram(this.extractProg.program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetBlurA.fb);
    gl.viewport(0, 0, this.targetBlurA.w, this.targetBlurA.h);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, curResult.tex);
    gl.uniform1i(this.extractProg.u.uTex, 0);
    gl.uniform2f(this.extractProg.u.uTexel, 1 / curResult.w, 1 / curResult.h);
    gl.uniform1f(this.extractProg.u.uDecode, this.hasHalfFloat ? 0 : 1);
    gl.uniform1f(this.extractProg.u.uPack, this.packFactor);
    gl.uniform1f(this.extractProg.u.uThreshold, 0.85);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 4. Blur passes
    const blurProg = this.blurProg;
    if (!blurProg) return;

    const runBlur = (src: RenderTarget, dst: RenderTarget, sx: number, sy: number) => {
      this.applyProgram(blurProg.program);
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb);
      gl.viewport(0, 0, dst.w, dst.h);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, src.tex);
      gl.uniform1i(blurProg.u.uTex, 0);
      gl.uniform2f(blurProg.u.uStep, sx / dst.w, sy / dst.h);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    runBlur(this.targetBlurA, this.targetBlurB, 1, 0);
    runBlur(this.targetBlurB, this.targetBlurA, 0, 1);
    runBlur(this.targetBlurA, this.targetBlurB, 2.6, 0);
    runBlur(this.targetBlurB, this.targetBlurA, 0, 2.6);

    // 5. Final composite pass to screen
    this.applyProgram(this.compositeProg.program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.viewWidth, this.viewHeight);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, curResult.tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.targetBlurA.tex);

    const cu = this.compositeProg.u;
    gl.uniform1i(cu.uScene, 0);
    gl.uniform1i(cu.uBloom, 1);
    gl.uniform2f(cu.uRes, this.viewWidth, this.viewHeight);
    gl.uniform1f(cu.uDecode, this.hasHalfFloat ? 0 : 1);
    gl.uniform1f(cu.uPack, this.packFactor);
    gl.uniform1f(cu.uGlow, Math.max(0, cfg.glow) * 0.26);
    gl.uniform1f(cu.uExposure, Math.max(0.05, cfg.exposure));
    gl.uniform1f(cu.uVignette, Math.max(0, Math.min(1, cfg.vignette)));
    gl.uniform1f(
      cu.uScrimDir,
      cfg.scrim === "left"
        ? 1
        : cfg.scrim === "right"
          ? 2
          : cfg.scrim === "top"
            ? 3
            : cfg.scrim === "bottom"
              ? 4
              : 0
    );
    gl.uniform1f(cu.uScrimAmt, Math.max(0, Math.min(1, cfg.scrimStrength)));
    gl.uniform1f(cu.uSeed, (timeSec * 60) % 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private renderLoop = (timestamp: number): void => {
    if (!this.isRunning) return;
    this.animFrameId = requestAnimationFrame(this.renderLoop);

    if (!this.isIntersecting) {
      this.lastTimestamp = timestamp;
      return;
    }

    const deltaSec = this.lastTimestamp
      ? Math.min(0.05, (timestamp - this.lastTimestamp) / 1000)
      : 0;
    this.lastTimestamp = timestamp;

    if (!this.config.paused && !this.isReducedMotion) {
      this.simTime += deltaSec;
    }
    this.renderFrame(this.simTime);
  };

  private attachObservers(): void {
    if (!this.container) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
      if (this.isReducedMotion || this.config.paused) {
        this.settle(16);
      }
    });
    this.resizeObserver.observe(this.container);

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        this.isIntersecting = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    this.intersectionObserver.observe(this.container);

    document.addEventListener("visibilitychange", this.onVisibilityChange);
    this.canvas?.addEventListener("webglcontextlost", this.onContextLost);
    this.canvas?.addEventListener("webglcontextrestored", this.onContextRestored);
  }

  private onVisibilityChange = (): void => {
    this.isIntersecting = !document.hidden;
    this.lastTimestamp = 0;
  };

  private onContextLost = (e: Event): void => {
    e.preventDefault();
    this.isRunning = false;
    cancelAnimationFrame(this.animFrameId);
    if (this.canvas) this.canvas.style.display = "none";
  };

  private onContextRestored = (): void => {
    this.viewWidth = 0;
    this.viewHeight = 0;
    this.renderWidth = 0;
    this.renderHeight = 0;
    if (!this.buildShadersAndGeometry()) {
      if (this.container) this.container.dataset.webgl = "lost";
      return;
    }
    if (this.canvas) this.canvas.style.display = "";
    this.handleResize();
    this.isRunning = true;
    this.lastTimestamp = 0;
    this.settle(this.isReducedMotion ? 16 : 1);
    if (!this.isReducedMotion) {
      this.animFrameId = requestAnimationFrame(this.renderLoop);
    }
  };

  updateConfig(newConfig: Partial<BlackholeEngineConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (this.isReducedMotion || this.config.paused) {
      this.settle(2);
    }
  }

  destroy(): void {
    this.isRunning = false;
    cancelAnimationFrame(this.animFrameId);

    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.canvas?.removeEventListener("webglcontextlost", this.onContextLost);
    this.canvas?.removeEventListener("webglcontextrestored", this.onContextRestored);

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

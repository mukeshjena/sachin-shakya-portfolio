/**
 * Blackhole Engine WebGL Utilities & Math Helpers
 * Pure WebGL deterministic helper functions and shader program linkers.
 * Universal Separation of Concerns (Rule 13) — Zero React dependencies.
 */

export interface ProgramInfo {
  readonly program: WebGLProgram;
  readonly u: Record<string, WebGLUniformLocation | null>;
}

export interface RenderTarget {
  readonly fb: WebGLFramebuffer;
  readonly tex: WebGLTexture;
  readonly w: number;
  readonly h: number;
}

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

export interface PrecisionBufferConfig {
  hasHalfFloat: boolean;
  texType: number;
  texFormat: number;
  filterMode: number;
  packFactor: number;
}

export const DEG_TO_RAD = Math.PI / 180;

export const JITTER_SAMPLES: readonly (readonly [number, number])[] = [
  [0.5, 0.333],
  [0.25, 0.667],
  [0.75, 0.111],
  [0.125, 0.444],
  [0.625, 0.778],
  [0.375, 0.222],
  [0.875, 0.556],
  [0.0625, 0.889],
];

export function hexToLinear(hex: string): [number, number, number] {
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

export function setupPrecisionBuffers(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  isWebGL2: boolean
): PrecisionBufferConfig {
  let hasHalfFloat = true;
  let texType: number = gl.UNSIGNED_BYTE;
  let texFormat: number = gl.RGBA;

  if (isWebGL2) {
    const gl2 = gl as WebGL2RenderingContext;
    if (
      gl2.getExtension("EXT_color_buffer_half_float") ||
      gl2.getExtension("EXT_color_buffer_float")
    ) {
      texType = gl2.HALF_FLOAT;
      texFormat = (gl2 as unknown as { RGBA16F: number }).RGBA16F || gl2.RGBA;
    } else {
      hasHalfFloat = false;
    }
  } else {
    const extHalf = gl.getExtension("OES_texture_half_float");
    const extColor = gl.getExtension("EXT_color_buffer_half_float");
    if (extHalf && extColor) {
      texType = extHalf.HALF_FLOAT_OES;
    } else {
      hasHalfFloat = false;
    }
  }

  if (!hasHalfFloat) {
    texType = gl.UNSIGNED_BYTE;
    texFormat = gl.RGBA;
  }

  const hasLinear =
    isWebGL2 || Boolean(gl.getExtension("OES_texture_half_float_linear")) || !hasHalfFloat;
  const filterMode = hasLinear ? gl.LINEAR : gl.NEAREST;
  const packFactor = hasHalfFloat ? 1 : 0.12;

  return {
    hasHalfFloat,
    texType,
    texFormat,
    filterMode,
    packFactor,
  };
}

export function compileShader(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  type: number,
  src: string
): WebGLShader | null {
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

export function linkProgram(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  vertSrc: string,
  fragSrc: string
): ProgramInfo | null {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
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

export function makeTarget(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  w: number,
  h: number,
  texFormat: number,
  texType: number,
  filterMode: number
): RenderTarget | null {
  const tex = gl.createTexture();
  const fb = gl.createFramebuffer();
  if (!tex || !fb) return null;

  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, texFormat, w, h, 0, gl.RGBA, texType, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMode);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMode);
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

export function dropTargets(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  targets: (RenderTarget | null)[]
): void {
  for (const t of targets) {
    if (t) {
      gl.deleteTexture(t.tex);
      gl.deleteFramebuffer(t.fb);
    }
  }
}

export function createQuadBuffer(
  gl: WebGLRenderingContext | WebGL2RenderingContext
): WebGLBuffer | null {
  const quadBuffer = gl.createBuffer();
  if (!quadBuffer) return null;
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);
  return quadBuffer;
}

export interface CameraBasis {
  camPos: [number, number, number];
  fwd: [number, number, number];
  right: [number, number, number];
  up: [number, number, number];
}

export function computeCameraBasis(cfg: BlackholeEngineConfig, timeSec: number): CameraBasis {
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

  return {
    camPos: [camX, camY, camZ],
    fwd: [fwdX, fwdY, fwdZ],
    right: [finalRightX, finalRightY, finalRightZ],
    up: [finalUpX, finalUpY, finalUpZ],
  };
}

export function getScrimDirectionCode(scrim: string): number {
  switch (scrim) {
    case "left":
      return 1;
    case "right":
      return 2;
    case "top":
      return 3;
    case "bottom":
      return 4;
    default:
      return 0;
  }
}

export function executeBloomPass(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  extractProg: ProgramInfo,
  blurProg: ProgramInfo,
  targetPrev: RenderTarget,
  targetBlurA: RenderTarget,
  targetBlurB: RenderTarget,
  packFactor: number
): void {
  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL method
  gl.useProgram(extractProg.program);
  gl.bindFramebuffer(gl.FRAMEBUFFER, targetBlurA.fb);
  gl.viewport(0, 0, targetBlurA.w, targetBlurA.h);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, targetPrev.tex);
  gl.uniform1i(extractProg.u.uTex, 0);
  gl.uniform1f(extractProg.u.uThreshold, 0.85);
  gl.uniform1f(extractProg.u.uPackFactor, packFactor);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL method
  gl.useProgram(blurProg.program);
  gl.bindFramebuffer(gl.FRAMEBUFFER, targetBlurB.fb);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, targetBlurA.tex);
  gl.uniform1i(blurProg.u.uTex, 0);
  gl.uniform2f(blurProg.u.uDir, 1.25 / targetBlurA.w, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.bindFramebuffer(gl.FRAMEBUFFER, targetBlurA.fb);
  gl.bindTexture(gl.TEXTURE_2D, targetBlurB.tex);
  gl.uniform1i(blurProg.u.uTex, 0);
  gl.uniform2f(blurProg.u.uDir, 0, 1.25 / targetBlurB.h);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

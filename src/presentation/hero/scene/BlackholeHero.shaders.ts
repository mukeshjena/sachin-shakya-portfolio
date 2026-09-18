// presentation/hero/scene/BlackholeHero.shaders.ts
// Custom GLSL shaders for the gravitational accretion disk and relativistic lensing glow.
// Strictly adheres to token palette: amber, cyan, and paper tones.

export const ACCRETION_DISK_VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute float aSpeed;
  attribute vec3 aColor;
  attribute float aAngle;
  attribute float aRadius;

  uniform float uTime;
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    // Relativistic orbital speed: inner particles orbit faster (Keplerian)
    float currentAngle = aAngle + (uTime * aSpeed);
    
    // Gravitational warping: slight vertical oscillation influenced by radius
    float warpY = sin(currentAngle * 2.0 + uTime * 0.5) * (aRadius * 0.08);

    vec3 transformed = vec3(
      cos(currentAngle) * aRadius,
      warpY,
      sin(currentAngle) * aRadius
    );

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Distance attenuation for particle scale
    gl_PointSize = aSize * uPixelRatio * (280.0 / -mvPosition.z);

    // Alpha falloff based on depth and distance
    vAlpha = smoothstep(12.0, 3.5, aRadius) * smoothstep(-80.0, -10.0, mvPosition.z);
  }
`;

export const ACCRETION_DISK_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Soft circular particle shape
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float strength = 1.0 - (dist * 2.0);
    strength = pow(strength, 1.6);

    gl_FragColor = vec4(vColor, vAlpha * strength);
  }
`;

export const EVENT_HORIZON_CORONA_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const EVENT_HORIZON_CORONA_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  uniform vec3 uCoronaColor;
  uniform float uTime;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Lensing rim glow calculation (Fresnel)
    float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
    fresnel = pow(fresnel, 3.5);

    // Subtle relativistic shimmer
    float pulse = 0.85 + 0.15 * sin(uTime * 1.5);

    gl_FragColor = vec4(uCoronaColor, fresnel * pulse * 0.8);
  }
`;

// presentation/hero/constants/hero.constants.ts
// Telemetry copy, shader configuration presets, and animation variants for 21st.dev Blackhole Hero.

export const HERO_COPY = {
  eyebrow: "ENTERPRISE ARCHITECTURE // RELATIVISTIC PRECISION",
  titleLine1: "Light does not",
  titleLine2: "leave here",
  subheadline:
    "The ring above the shadow is the far side of the disc, bent over the top. Gravitational precision engineered for mission-critical multi-cloud infrastructure.",
  ctaPrimary: "Explore Architecture",
  ctaSecondary: "Mission Telemetry",
  scrollPrompt: "DISCOVER TELEMETRY",
} as const;

export const DESKTOP_BLACKHOLE_SETTINGS = {
  focus: [0.72, 0.46] as const,
  scrim: "left" as const,
  scrimStrength: 0.92,
  distance: 24,
  elevation: -5.5,
  fov: 42,
  glow: 1.0,
  steps: 300,
  resolution: 0.72,
} as const;

export const MOBILE_BLACKHOLE_SETTINGS = {
  focus: [0.5, 0.76] as const,
  scrim: "top" as const,
  scrimStrength: 0.92,
  distance: 24,
  elevation: -7.0,
  fov: 58,
  glow: 0.85,
  steps: 200,
  resolution: 0.6,
} as const;

export const HERO_ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.15,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  },
} as const;

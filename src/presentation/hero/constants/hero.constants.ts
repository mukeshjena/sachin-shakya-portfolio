// presentation/hero/constants/hero.constants.ts
// Telemetry copy, shader configuration presets, and animation variants for 21st.dev Blackhole Hero.

export const HERO_COPY = {
  eyebrow: "LEAD CLOUD ARCHITECT // FINOPS & SRE EXECUTIVE",
  titleLine1: "Architecting Autonomous",
  titleLine2: "Cloud Horizons",
  subheadline:
    "Engineering resilient multi-cloud architectures, mission-critical Kubernetes clusters, and automated FinOps telemetry delivering $170K/month in verified cloud efficiency.",
  ctaPrimary: "Explore Telemetry",
  ctaSecondary: "Download CV",
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
  focus: [0.5, 0.52] as const,
  scrim: "none" as const,
  scrimStrength: 0.85,
  distance: 26,
  elevation: -6.0,
  fov: 52,
  glow: 0.9,
  steps: 220,
  resolution: 0.65,
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

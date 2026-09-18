// presentation/hero/constants/hero.constants.ts
// Telemetry descriptors, copy fallbacks, and animation variants for the Sci-Fi Hero.

export const HERO_FALLBACK_CONTENT = {
  eyebrow: "LEAD CLOUD ARCHITECT & FINOPS CONSULTANT",
  headline: "Enterprise Cloud Reliability at Mission-Critical Scale",
  subheadline:
    "Architecting high-availability multi-cloud landing zones across Azure & AWS, slashing monthly cloud expenditure by $170K, and cutting operational incident MTTR by 40%.",
  ctaPrimary: "Explore Architecture Telemetry",
  ctaSecondary: "Executive Résumé",
  statusTag: "SYSTEM TELEMETRY // ALL NODES OPERATIONAL",
} as const;

export const HERO_KEY_METRICS = [
  {
    label: "FinOps Cost Savings",
    value: "$170K/mo",
    description: "Cloud spend reduction delivered",
    accent: "amber",
  },
  {
    label: "Incident MTTR",
    value: "-40%",
    description: "Mean time to resolution cut",
    accent: "cyan",
  },
  {
    label: "Managed Fleet",
    value: "2,000+",
    description: "Production cloud resources",
    accent: "live",
  },
] as const;

export const HERO_INFRA_BADGES = [
  "Microsoft Azure",
  "Amazon Web Services",
  "Kubernetes (AKS/EKS)",
  "Terraform IaC",
  "Datadog Telemetry",
  "FinOps Certified",
] as const;

export const HERO_ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  },
} as const;

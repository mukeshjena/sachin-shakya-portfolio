// presentation/overview/constants/overview.constants.ts
// Telemetry descriptors, copy fallbacks, and animation variants for the Executive Overview section.

export const OVERVIEW_FALLBACK_CONTENT = {
  eyebrow: "TECHNICAL LEAD — CLOUDOPS",
  headline: "Enterprise Cloud Reliability at Mission-Critical Scale",
  subheadline:
    "Operating high-availability multi-cloud platforms across Azure & AWS, eliminating $170K/month in cloud spend, and cutting operational incident MTTR by 40%.",
  ctaPrimary: "Explore Architecture",
  ctaSecondary: "Download Résumé",
  statusTag: "ENTERPRISE ARCHITECTURE // HIGH AVAILABILITY ACTIVE",
} as const;

export const OVERVIEW_KEY_METRICS = [
  {
    label: "Cloud Cost Savings",
    value: "$170K/mo",
    description: "Monthly cloud spend eliminated",
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

export type InfraBadgeIconKey = "azure" | "aws" | "k8s" | "terraform" | "datadog" | "finops";

export interface InfraStackBadge {
  readonly name: string;
  readonly iconKey: InfraBadgeIconKey;
}

export const OVERVIEW_INFRA_BADGES: readonly InfraStackBadge[] = [
  { name: "Microsoft Azure", iconKey: "azure" },
  { name: "Amazon Web Services", iconKey: "aws" },
  { name: "Kubernetes (AKS/EKS)", iconKey: "k8s" },
  { name: "Terraform IaC", iconKey: "terraform" },
  { name: "Datadog Observability", iconKey: "datadog" },
  { name: "CloudOps Leadership", iconKey: "finops" },
] as const;

export const OVERVIEW_ANIMATION_VARIANTS = {
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

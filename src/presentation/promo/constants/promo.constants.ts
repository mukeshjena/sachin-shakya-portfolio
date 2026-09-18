// presentation/promo/constants/promo.constants.ts
// Static copy, aria labels, timing thresholds, and storage keys for Promo Popup.
// Zero JSX or business logic (Universal Separation of Concerns — Rule 13).

export const PROMO_STORAGE_KEYS = {
  DISMISSED_SESSION: "sachin_promo_dismissed_session",
  SUBMITTED_SESSION: "sachin_promo_submitted_session",
} as const;

export const PROMO_DEFAULTS = {
  FALLBACK_DELAY_SECONDS: 6,
  AUTO_CLOSE_SUCCESS_MS: 3500,
} as const;

export const PROMO_COPY = {
  DEFAULT_BADGE: "CLOUDOPS & DEVOPS CONSULTATION",
  DEFAULT_HEADING: "Optimize Your Cloud Infrastructure",
  DEFAULT_SUBHEADING:
    "Looking to reduce Azure/AWS spend or accelerate your DevOps delivery pipeline? Let's schedule a 30-minute cloud architecture review.",
  CTA_BUTTON: "Request Executive Review",
  SUBMITTING: "Transmitting Request...",
  SUCCESS_BADGE: "CONSULTATION INITIATED",
  SUCCESS_TITLE: "Executive Consultation Reserved",
  SUCCESS_MESSAGE:
    "Your architecture review request has been routed directly to Sachin Shakya. An initial discovery response will arrive within 24 hours.",
  CLOSE_ARIA: "Close consultation review modal",
  NAME_LABEL: "Full Name",
  NAME_PLACEHOLDER: "e.g. John Doe / Lead Enterprise Architect",
  EMAIL_LABEL: "Corporate / Direct Email",
  EMAIL_PLACEHOLDER: "sachin.shakya@live.com",
  FOCUS_LABEL: "Consultation Focus",
  MESSAGE_LABEL: "Specific Workload / Scope (Optional)",
  MESSAGE_PLACEHOLDER:
    "e.g. Multi-cloud Kubernetes migration, Cloud cost reclamation, CI/CD MTTR reduction...",
  DISMISS_BUTTON: "Maybe Later",
  TELEMETRY_PILL: "DIRECT ARCHITECT ENGAGEMENT // < 24H SLA",
} as const;

export const CONSULTATION_INTEREST_OPTIONS = [
  { value: "Cloud Cost Optimization", label: "Cloud Cost Optimization ($170K/mo Benchmark)" },
  { value: "Multi-Cloud Architecture", label: "Multi-Cloud Architecture (Azure / AWS / GCP)" },
  { value: "Kubernetes & Containers", label: "Kubernetes Orchestration (AKS / EKS / Helm)" },
  { value: "DevOps & CI/CD Automation", label: "CI/CD & DevOps Automation (40% MTTR Reduction)" },
  { value: "SRE & APM Observability", label: "Observability & SRE (Datadog / Dynatrace)" },
  { value: "General Leadership Advisory", label: "Interim Cloud Director / Fractional Advisory" },
] as const;

export const PROMO_METRICS = [
  { label: "Cost Savings", value: "$170K/mo" },
  { label: "MTTR Reduction", value: "40%" },
  { label: "Managed Fleet", value: "2,000+" },
] as const;

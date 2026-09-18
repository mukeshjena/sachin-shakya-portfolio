// presentation/shell/footer/constants/footer.constants.ts
// Constants and navigation descriptors for the universal executive footer.
// Zero emojis, strictly outline Cupertino iconography metadata.

export const FOOTER_COPY = {
  summaryHeadline: "Enterprise Cloud Reliability & CloudOps Governance",
  summaryDescription:
    "Architecting automated multi-cloud landing zones, Kubernetes clusters, and CloudOps cost governance at Fortune 500 scale. Documented $170K/month cloud cost reduction and 40% MTTR improvement.",
  navHeading: "NAVIGATION",
  stackHeading: "CORE INFRASTRUCTURE",
  connectHeading: "DIRECT ACCESS",
} as const;

export const FOOTER_DEFAULT_SECTION_LINKS = [
  { id: "top", label: "Home", href: "#top" },
  { id: "telemetry", label: "Architecture & Metrics", href: "#telemetry" },
  { id: "impact", label: "Executive Overview", href: "#impact" },
  { id: "experience", label: "Enterprise Experience", href: "#experience" },
  { id: "capabilities", label: "Core Competencies", href: "#capabilities" },
  { id: "credentials", label: "Certifications & Education", href: "#credentials" },
  { id: "contact", label: "Consultation & Contact", href: "#contact" },
] as const;

export const FOOTER_STACK_ITEMS = [
  "Microsoft Azure & AKS",
  "AWS Multi-Account Landing Zones",
  "Terraform & OpenTofu IaC",
  "Azure DevOps YAML Pipelines",
  "Datadog, Dynatrace & Azure Monitor",
  "Cloud Cost Optimization",
] as const;

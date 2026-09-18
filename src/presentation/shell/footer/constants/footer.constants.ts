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
  { id: "top", label: "Mission Control", href: "#top" },
  { id: "telemetry", label: "Cloud Fleet Telemetry", href: "#telemetry" },
  { id: "impact", label: "Financial & MTTR Impact", href: "#impact" },
  { id: "experience", label: "Enterprise Experience", href: "#experience" },
  { id: "capabilities", label: "Technical Capabilities", href: "#capabilities" },
  { id: "credentials", label: "Certifications & Degrees", href: "#credentials" },
  { id: "contact", label: "Direct Inquiries", href: "#contact" },
] as const;

export const FOOTER_STACK_ITEMS = [
  "Microsoft Azure & AKS",
  "AWS Multi-Account Landing Zones",
  "Terraform & OpenTofu IaC",
  "Azure DevOps YAML Pipelines",
  "Datadog, Dynatrace & Azure Monitor",
  "FinOps Cloud Cost Reclamation",
] as const;

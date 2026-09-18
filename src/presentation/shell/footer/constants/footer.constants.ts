// presentation/shell/footer/constants/footer.constants.ts
// Constants and telemetry descriptors for the universal footer.

export const FOOTER_COPY = {
  telemetryStamp:
    "EDGE // HIGH-PERFORMANCE RUNTIME &bull; DISTRIBUTED PERSISTENT CACHE &bull; PURE SCI-FI TELEMETRY",
  systemStatus: "ALL SUBSYSTEMS NOMINAL // 99.99% FLEET UPTIME",
  summaryHeadline: "Enterprise Cloud Reliability & CloudOps Governance",
  summaryDescription:
    "Architecting automated multi-cloud landing zones, Kubernetes clusters, and CloudOps cost governance at Fortune 500 scale. Documented $170K/month cloud cost reduction and 40% MTTR improvement.",
  navHeading: "NAVIGATION",
  telemetryHeading: "OPERATIONAL TELEMETRY",
  connectHeading: "COMMUNICATION CHANNELS",
} as const;

export const FOOTER_DEFAULT_SECTION_LINKS = [
  { id: "top", label: "Mission Control", href: "#top" },
  { id: "impact", label: "Financial & MTTR Impact", href: "#impact" },
  { id: "telemetry", label: "Cloud Fleet Telemetry", href: "#telemetry" },
  { id: "experience", label: "Enterprise Experience", href: "#experience" },
  { id: "capabilities", label: "Technical Capabilities", href: "#capabilities" },
  { id: "credentials", label: "Certifications & Degrees", href: "#credentials" },
  { id: "contact", label: "Direct Inquiries", href: "#contact" },
] as const;

export const FOOTER_TELEMETRY_PILLS = [
  { label: "Cost Run-Rate", value: "$170K / month reduction" },
  { label: "Incident MTTR", value: "40% reduction across P1-P3" },
  { label: "Multi-Cloud Fleet", value: "2,000+ managed cloud resources" },
  { label: "Automation Ratio", value: "30-40% manual toil eliminated" },
] as const;

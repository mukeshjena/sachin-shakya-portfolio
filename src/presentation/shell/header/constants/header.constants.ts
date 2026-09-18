// presentation/shell/header/constants/header.constants.ts
// Navigation items, telemetry copy, and default labels for the desktop header.

export interface NavLinkItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly isAnchor: boolean;
}

export const DEFAULT_HEADER_SECTION_LINKS: readonly NavLinkItem[] = [
  { id: "telemetry", label: "Architecture & Metrics", href: "#telemetry", isAnchor: true },
  { id: "impact", label: "Overview", href: "#impact", isAnchor: true },
  { id: "experience", label: "Experience", href: "#experience", isAnchor: true },
  { id: "capabilities", label: "Capabilities", href: "#capabilities", isAnchor: true },
  { id: "credentials", label: "Credentials", href: "#credentials", isAnchor: true },
  { id: "contact", label: "Contact", href: "#contact", isAnchor: true },
];

export const HEADER_COPY = {
  brandTitle: "SACHIN SHAKYA",
  brandSubtitle: "LEAD CLOUD ARCHITECT",
  availabilityDefault: "AVAILABLE FOR ADVISORY",
  contactCta: "Contact",
} as const;

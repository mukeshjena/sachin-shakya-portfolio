// presentation/shell/footer/Footer.types.ts
// Contract and state types for universal Footer component.

import type { SocialLink } from "../../../domain/entities/admin/SiteSettings";

export interface FooterNavItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

export interface FooterState {
  readonly currentYear: number;
  readonly fullName: string;
  readonly headline: string;
  readonly email: string;
  readonly location: string;
  readonly logoUrl?: string;
  readonly resumePdfUrl?: string;
  readonly socialLinks: readonly SocialLink[];
  readonly navItems: readonly FooterNavItem[];
}

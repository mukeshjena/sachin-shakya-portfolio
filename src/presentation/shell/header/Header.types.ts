// presentation/shell/header/Header.types.ts
// Contract and type declarations for the desktop Header component.

import type { NavLinkItem } from "./constants/header.constants";

export interface HeaderState {
  readonly isScrolled: boolean;
  readonly logoUrl: string;
  readonly fullName: string;
  readonly availabilityStatus: string;
  readonly availabilityNote: string;
  readonly navLinks: readonly NavLinkItem[];
  readonly resumePdfUrl?: string;
  readonly activeSection: string;
}

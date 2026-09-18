// presentation/shell/bottom-nav/MobileBottomNav.types.ts
// Contract and state types for the mobile bottom nav dock.

import type { MobileBottomNavTab } from "./constants/bottomNav.constants";

export interface MobileBottomNavProps {
  readonly onTabSelect?: (href: string) => void;
}

export interface MobileBottomNavState {
  readonly activeTabId: string;
  readonly tabs: readonly MobileBottomNavTab[];
  readonly setActiveTabId: (id: string) => void;
}

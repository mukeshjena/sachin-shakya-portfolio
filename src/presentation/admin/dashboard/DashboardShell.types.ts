// presentation/admin/dashboard/DashboardShell.types.ts
// Type contracts for the DashboardShell presentation component.

import type { DashboardTabId } from "./constants/dashboard.constants";

export interface DashboardMetrics {
  readonly pageCount: number;
  readonly inquiryCount: number;
  readonly adminCount: number;
  readonly lastSyncedAt: Date | null;
  readonly isSyncing: boolean;
}

export interface DashboardPageItem {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly isPublished: boolean;
  readonly showInHeader: boolean;
  readonly showInFooter: boolean;
}

export interface DashboardContactItem {
  readonly id: string;
  readonly name?: string;
  readonly email?: string;
  readonly company?: string;
  readonly message?: string;
  readonly source?: string;
  readonly createdAt?: string;
}

export interface DashboardShellViewModel {
  readonly activeTab: DashboardTabId;
  readonly setActiveTab: (tab: DashboardTabId) => void;
  readonly metrics: DashboardMetrics;
  readonly pages: DashboardPageItem[];
  readonly contacts: DashboardContactItem[];
  readonly currentUserEmail: string | null;
  readonly isMobileNavOpen: boolean;
  readonly toggleMobileNav: () => void;
  readonly closeMobileNav: () => void;
  readonly handleLogout: () => void;
}

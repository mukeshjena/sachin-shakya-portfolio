// presentation/admin/dashboard/DashboardShell.hooks.ts
// Hook coordinating realtime Firestore listeners, navigation tabs, and telemetry stats.
// Clean Architecture: consumes useRealtimeSync and useAuth without raw SDK imports.

import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../../providers/auth/useAuth";
import { useRealtimeSync } from "../../shared/hooks/useRealtimeSync";
import type { DashboardTabId } from "./constants/dashboard.constants";
import type {
  DashboardContactItem,
  DashboardMetrics,
  DashboardPageItem,
  DashboardShellViewModel,
} from "./DashboardShell.types";

interface AdminEmailDoc {
  readonly id: string;
  readonly email?: string;
}

export function useDashboardShell(): DashboardShellViewModel {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTabId>("overview");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Realtime multi-tab subscribers
  const {
    data: pages,
    isLoading: isPagesLoading,
    lastSyncedAt: pagesSyncedAt,
  } = useRealtimeSync<DashboardPageItem>("pages");

  const {
    data: contacts,
    isLoading: isContactsLoading,
    lastSyncedAt: contactsSyncedAt,
  } = useRealtimeSync<DashboardContactItem>("contactSubmissions");

  const {
    data: adminDocs,
    isLoading: isAdminDocsLoading,
    lastSyncedAt: adminsSyncedAt,
  } = useRealtimeSync<AdminEmailDoc>("adminEmails");

  const toggleMobileNav = useCallback(() => {
    setIsMobileNavOpen((prev) => !prev);
  }, []);

  const closeMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  const handleTabSelect = useCallback((tab: DashboardTabId) => {
    setActiveTab(tab);
    setIsMobileNavOpen(false);
  }, []);

  // Compute telemetry metrics
  const metrics: DashboardMetrics = useMemo(() => {
    const latestTimestamp = [
      pagesSyncedAt?.getTime() || 0,
      contactsSyncedAt?.getTime() || 0,
      adminsSyncedAt?.getTime() || 0,
    ].reduce((max, curr) => (curr > max ? curr : max), 0);

    return {
      pageCount: pages.length,
      inquiryCount: contacts.length,
      // Ensure at least root admin is accounted for if collection is empty
      adminCount: Math.max(adminDocs.length, 1),
      lastSyncedAt: latestTimestamp > 0 ? new Date(latestTimestamp) : null,
      isSyncing: isPagesLoading || isContactsLoading || isAdminDocsLoading,
    };
  }, [
    pages.length,
    contacts.length,
    adminDocs.length,
    pagesSyncedAt,
    contactsSyncedAt,
    adminsSyncedAt,
    isPagesLoading,
    isContactsLoading,
    isAdminDocsLoading,
  ]);

  return {
    activeTab,
    setActiveTab: handleTabSelect,
    metrics,
    pages,
    contacts,
    currentUserEmail: user?.email || null,
    isMobileNavOpen,
    toggleMobileNav,
    closeMobileNav,
    handleLogout: logout,
  };
}

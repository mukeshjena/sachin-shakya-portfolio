// presentation/admin/dashboard/DashboardShell.types.ts
// Type contracts for the DashboardShell presentation component and its tabs.

import type { MediaAsset } from "../../../domain/entities/content/MediaAsset";
import type { Section } from "../../../domain/entities/content/Section";
import type { MenuItemAction } from "../../shared/menu/ThreeDotMenu.types";
import type { DashboardTabId } from "./constants/dashboard.constants";

export interface DashboardMetrics {
  readonly pageCount: number;
  readonly inquiryCount: number;
  readonly adminCount: number;
  readonly mediaCount: number;
  readonly lastSyncedAt: Date | null;
  readonly isSyncing: boolean;
}

export interface DashboardPageItem {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly richContent?: string;
  readonly category?: string;
  readonly order?: number;
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
  readonly isRead?: boolean;
  readonly createdAt?: string;
}

export interface DashboardConfirmState {
  readonly isOpen: boolean;
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly isDestructive?: boolean;
  readonly isLoading?: boolean;
  readonly onConfirm: () => Promise<void> | void;
}

export interface DashboardShellViewModel {
  readonly activeTab: DashboardTabId;
  readonly setActiveTab: (tab: DashboardTabId) => void;
  readonly metrics: DashboardMetrics;
  readonly pages: readonly DashboardPageItem[];
  readonly contacts: readonly DashboardContactItem[];
  readonly sections: readonly Section[];
  readonly mediaAssets: readonly MediaAsset[];
  readonly currentUserEmail: string | null;
  readonly isMobileNavOpen: boolean;
  readonly toggleMobileNav: () => void;
  readonly closeMobileNav: () => void;
  readonly isCollapsed: boolean;
  readonly toggleSidebarCollapsed: () => void;
  readonly handleLogout: () => void;

  // Confirmation Dialog State
  readonly confirmState: DashboardConfirmState | null;
  readonly closeConfirm: () => void;

  // Page Editor State
  readonly isPageModalOpen: boolean;
  readonly pageToEdit: DashboardPageItem | null;
  readonly openCreatePage: () => void;
  readonly openEditPage: (page: DashboardPageItem) => void;
  readonly closePageModal: () => void;
  readonly getPageRowActions: (pageId: string, slug: string) => MenuItemAction[];

  // Section Editor State
  readonly isSectionModalOpen: boolean;
  readonly sectionToEdit: Section | null;
  readonly openEditSection: (section: Section) => void;
  readonly closeSectionModal: () => void;
  readonly handleMoveSection: (sectionId: string, direction: "up" | "down") => Promise<void>;
  readonly handleToggleSectionVisibility: (section: Section) => Promise<void>;

  // Telemetry Editor State
  readonly isTelemetryModalOpen: boolean;
  readonly openTelemetryModal: () => void;
  readonly closeTelemetryModal: () => void;

  // Media Library State
  readonly isMediaPickerOpen: boolean;
  readonly openMediaPicker: () => void;
  readonly closeMediaPicker: () => void;
  readonly handleDeleteMedia: (id: string, publicId: string) => Promise<void>;

  // Contacts Actions
  readonly handleToggleContactRead: (id: string, currentStatus: boolean) => Promise<void>;
  readonly handleDeleteContact: (id: string) => void;
  readonly getContactRowActions: (
    contactId: string,
    email?: string,
    isRead?: boolean
  ) => MenuItemAction[];
}

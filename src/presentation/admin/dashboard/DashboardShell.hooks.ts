// presentation/admin/dashboard/DashboardShell.hooks.ts
// Hook coordinating realtime Firestore listeners, navigation tabs, telemetry stats, and modal dialogs.
// Clean Architecture: consumes useContainer, useRealtimeSync, and useAuth without raw SDK imports.

import { useCallback, useMemo, useState } from "react";
import type { IDeleteContactSubmissionUseCase } from "../../../application/use-cases/contact/DeleteContactSubmissionUseCase";
import type { IUpdateContactStatusUseCase } from "../../../application/use-cases/contact/UpdateContactStatusUseCase";
import type { IDeleteMediaUseCase } from "../../../application/use-cases/media/DeleteMediaUseCase";
import type { IDeletePageUseCase } from "../../../application/use-cases/pages/mutation/DeletePageUseCase";
import type { IReorderSectionsUseCase } from "../../../application/use-cases/pages/mutation/ReorderSectionsUseCase";
import type { ISaveSectionUseCase } from "../../../application/use-cases/sections/SaveSectionUseCase";
import type { MediaAsset } from "../../../domain/entities/content/MediaAsset";
import type { Section } from "../../../domain/entities/content/Section";
import { DI_TOKENS } from "../../../infrastructure/di/tokens";
import { useAuth } from "../../providers/auth/useAuth";
import { useRealtimeSync } from "../../shared/hooks/useRealtimeSync";
import type { MenuItemAction } from "../../shared/menu/ThreeDotMenu.types";
import { useContainer } from "../../shared/useContainer";
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

const DEFAULT_SECTIONS: readonly Section[] = [
  {
    id: "hero",
    pageId: "home",
    type: "hero",
    title: "Hero & Accretion Horizon",
    content: {},
    order: 0,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "telemetry",
    pageId: "home",
    type: "telemetry",
    title: "CloudOps & Spend Telemetry",
    content: {},
    order: 1,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "impact",
    pageId: "home",
    type: "impact",
    title: "Enterprise Impact & Metrics",
    content: {},
    order: 2,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "experience",
    pageId: "home",
    type: "experience",
    title: "Professional Trajectory Timeline",
    content: {},
    order: 3,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "capabilities",
    pageId: "home",
    type: "capabilities",
    title: "Core Architecture Capabilities",
    content: {},
    order: 4,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "credentials",
    pageId: "home",
    type: "credentials",
    title: "Certifications & Qualifications",
    content: {},
    order: 5,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "contact",
    pageId: "home",
    type: "contact",
    title: "Consultation & Contact Desk",
    content: {},
    order: 6,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function useDashboardShell(): DashboardShellViewModel {
  const { user, logout } = useAuth();
  const deletePageUseCase = useContainer<IDeletePageUseCase>(DI_TOKENS.DeletePage);
  const reorderSectionsUseCase = useContainer<IReorderSectionsUseCase>(DI_TOKENS.ReorderSections);
  const saveSectionUseCase = useContainer<ISaveSectionUseCase>(DI_TOKENS.SaveSection);
  const deleteMediaUseCase = useContainer<IDeleteMediaUseCase>(DI_TOKENS.DeleteMedia);
  const updateContactStatusUseCase = useContainer<IUpdateContactStatusUseCase>(
    DI_TOKENS.UpdateContactStatus
  );
  const deleteContactSubmissionUseCase = useContainer<IDeleteContactSubmissionUseCase>(
    DI_TOKENS.DeleteContactSubmission
  );

  const [activeTab, setActiveTab] = useState<DashboardTabId>("overview");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Modal State
  const [isPageModalOpen, setIsPageModalOpen] = useState<boolean>(false);
  const [pageToEdit, setPageToEdit] = useState<DashboardPageItem | null>(null);

  const [isSectionModalOpen, setIsSectionModalOpen] = useState<boolean>(false);
  const [sectionToEdit, setSectionToEdit] = useState<Section | null>(null);

  const [isTelemetryModalOpen, setIsTelemetryModalOpen] = useState<boolean>(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState<boolean>(false);

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
  } = useRealtimeSync<DashboardContactItem>("contactSubmissions", {
    orderByField: "createdAt",
    orderDirection: "desc",
  });

  const {
    data: mediaAssets,
    isLoading: isMediaLoading,
    lastSyncedAt: mediaSyncedAt,
  } = useRealtimeSync<MediaAsset>("mediaAssets", {
    orderByField: "createdAt",
    orderDirection: "desc",
  });

  const {
    data: adminDocs,
    isLoading: isAdminDocsLoading,
    lastSyncedAt: adminsSyncedAt,
  } = useRealtimeSync<AdminEmailDoc>("adminEmails");

  const { data: realtimeSections } = useRealtimeSync<Section>("sections", {
    orderByField: "order",
    orderDirection: "asc",
  });

  const sections = useMemo(() => {
    const homeSections = realtimeSections.filter((s) => !s.pageId || s.pageId === "home");
    return homeSections.length > 0
      ? [...homeSections].sort((a, b) => a.order - b.order)
      : DEFAULT_SECTIONS;
  }, [realtimeSections]);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const toggleSidebarCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

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
      mediaSyncedAt?.getTime() || 0,
    ].reduce((max, curr) => (curr > max ? curr : max), 0);

    return {
      pageCount: pages.length,
      inquiryCount: contacts.length,
      adminCount: Math.max(adminDocs.length, 1),
      mediaCount: mediaAssets.length,
      lastSyncedAt: latestTimestamp > 0 ? new Date(latestTimestamp) : null,
      isSyncing: isPagesLoading || isContactsLoading || isAdminDocsLoading || isMediaLoading,
    };
  }, [
    pages.length,
    contacts.length,
    adminDocs.length,
    mediaAssets.length,
    pagesSyncedAt,
    contactsSyncedAt,
    adminsSyncedAt,
    mediaSyncedAt,
    isPagesLoading,
    isContactsLoading,
    isAdminDocsLoading,
    isMediaLoading,
  ]);

  // Page Actions
  const openCreatePage = useCallback(() => {
    setPageToEdit(null);
    setIsPageModalOpen(true);
  }, []);

  const openEditPage = useCallback((page: DashboardPageItem) => {
    setPageToEdit(page);
    setIsPageModalOpen(true);
  }, []);

  const closePageModal = useCallback(() => {
    setIsPageModalOpen(false);
    setPageToEdit(null);
  }, []);

  const handleDeletePage = useCallback(
    async (pageId: string, slug: string) => {
      if (slug === "home" || pageId === "home") {
        alert("The primary root 'home' page is immutable and cannot be deleted.");
        return;
      }
      const confirmed = window.confirm(
        `Are you sure you want to permanently delete page '/${slug}'?`
      );
      if (!confirmed) return;

      try {
        await deletePageUseCase.execute({ id: pageId, slug });
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete page.");
      }
    },
    [deletePageUseCase]
  );

  const getPageRowActions = useCallback(
    (pageId: string, slug: string): MenuItemAction[] => {
      const targetPage = pages.find((p) => p.id === pageId) || {
        id: pageId,
        slug,
        title: slug,
        isPublished: true,
        showInHeader: true,
        showInFooter: true,
      };

      return [
        {
          id: `edit-${pageId}`,
          label: "Edit Page",
          onClick: () => {
            openEditPage(targetPage);
          },
        },
        {
          id: `preview-${pageId}`,
          label: "Preview Live",
          onClick: () => {
            window.open(`/${slug === "home" ? "" : slug}`, "_blank");
          },
        },
        {
          id: `delete-${pageId}`,
          label: "Delete Page",
          danger: true,
          onClick: () => {
            handleDeletePage(pageId, slug);
          },
        },
      ];
    },
    [pages, openEditPage, handleDeletePage]
  );

  // Section Actions
  const openEditSection = useCallback((section: Section) => {
    setSectionToEdit(section);
    setIsSectionModalOpen(true);
  }, []);

  const closeSectionModal = useCallback(() => {
    setIsSectionModalOpen(false);
    setSectionToEdit(null);
  }, []);

  const handleMoveSection = useCallback(
    async (sectionId: string, direction: "up" | "down") => {
      const idx = sections.findIndex((s) => s.id === sectionId);
      if (idx === -1) return;
      if (direction === "up" && idx === 0) return;
      if (direction === "down" && idx === sections.length - 1) return;

      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      const reordered = [...sections];
      const temp = reordered[idx];
      const target = reordered[targetIdx];
      if (!temp || !target) return;

      reordered[idx] = target;
      reordered[targetIdx] = temp;

      try {
        await reorderSectionsUseCase.execute(
          temp.pageId || "home",
          reordered.map((s) => s.id)
        );
      } catch (err) {
        console.error("Failed to reorder sections:", err);
      }
    },
    [sections, reorderSectionsUseCase]
  );

  const handleToggleSectionVisibility = useCallback(
    async (section: Section) => {
      try {
        await saveSectionUseCase.execute({
          id: section.id,
          pageId: section.pageId || "home",
          type: section.type,
          title: section.title,
          isVisible: !section.isVisible,
          content: section.content || {},
        });
      } catch (err) {
        console.error("Failed to toggle section visibility:", err);
      }
    },
    [saveSectionUseCase]
  );

  // Telemetry Actions
  const openTelemetryModal = useCallback(() => {
    setIsTelemetryModalOpen(true);
  }, []);

  const closeTelemetryModal = useCallback(() => {
    setIsTelemetryModalOpen(false);
  }, []);

  // Media Library Actions
  const openMediaPicker = useCallback(() => {
    setIsMediaPickerOpen(true);
  }, []);

  const closeMediaPicker = useCallback(() => {
    setIsMediaPickerOpen(false);
  }, []);

  const handleDeleteMedia = useCallback(
    async (id: string, publicId: string) => {
      try {
        await deleteMediaUseCase.execute({ id, publicId });
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete media asset.");
      }
    },
    [deleteMediaUseCase]
  );

  // Contact Submission Actions
  const handleToggleContactRead = useCallback(
    async (id: string, currentStatus: boolean) => {
      try {
        await updateContactStatusUseCase.execute({ id, isRead: !currentStatus });
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to update inquiry status.");
      }
    },
    [updateContactStatusUseCase]
  );

  const handleDeleteContact = useCallback(
    async (id: string) => {
      const confirmed = window.confirm(
        "Are you sure you want to permanently delete this inquiry submission?"
      );
      if (!confirmed) return;

      try {
        await deleteContactSubmissionUseCase.execute({ id });
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete inquiry.");
      }
    },
    [deleteContactSubmissionUseCase]
  );

  const getContactRowActions = useCallback(
    (contactId: string, email?: string, isRead?: boolean): MenuItemAction[] => [
      {
        id: `toggle-read-${contactId}`,
        label: isRead ? "Mark as Unread" : "Mark as Read",
        onClick: () => {
          handleToggleContactRead(contactId, isRead ?? false);
        },
      },
      ...(email
        ? [
            {
              id: `copy-email-${contactId}`,
              label: "Copy Email",
              onClick: () => {
                navigator.clipboard.writeText(email);
              },
            },
          ]
        : []),
      {
        id: `delete-${contactId}`,
        label: "Delete Inquiry",
        danger: true,
        onClick: () => {
          handleDeleteContact(contactId);
        },
      },
    ],
    [handleToggleContactRead, handleDeleteContact]
  );

  return {
    activeTab,
    setActiveTab: handleTabSelect,
    metrics,
    pages,
    contacts,
    sections,
    mediaAssets,
    currentUserEmail: user?.email || null,
    isMobileNavOpen,
    toggleMobileNav,
    closeMobileNav,
    isCollapsed,
    toggleSidebarCollapsed,
    handleLogout: logout,

    // Modals
    isPageModalOpen,
    pageToEdit,
    openCreatePage,
    openEditPage,
    closePageModal,
    getPageRowActions,

    isSectionModalOpen,
    sectionToEdit,
    openEditSection,
    closeSectionModal,
    handleMoveSection,
    handleToggleSectionVisibility,

    isTelemetryModalOpen,
    openTelemetryModal,
    closeTelemetryModal,

    // Media
    isMediaPickerOpen,
    openMediaPicker,
    closeMediaPicker,
    handleDeleteMedia,

    // Contacts
    handleToggleContactRead,
    handleDeleteContact,
    getContactRowActions,
  };
}

// presentation/admin/dashboard/DashboardShell.tsx
// Executive Instrument Panel Admin Dashboard Shell.
// Shadow-free surfaces with hairline borders and zero emojis.
// Modular tabs and modals integration (Rule 13).

import {
  IoArrowBackOutline,
  IoCloseOutline,
  IoDocumentTextOutline,
  IoGridOutline,
  IoImageOutline,
  IoLayersOutline,
  IoLogOutOutline,
  IoMailOutline,
  IoMenuOutline,
  IoSettingsOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { PageEditorModal } from "../content/pages/PageEditorModal";
import { SectionEditorModal } from "../content/sections/SectionEditorModal";
import { TelemetryEditorModal } from "../content/telemetry/TelemetryEditorModal";
import { MediaPicker } from "../media/MediaPicker";
import {
  DASHBOARD_COPY,
  DASHBOARD_NAV_TABS,
  type DashboardTabId,
} from "./constants/dashboard.constants";
import { useDashboardShell } from "./DashboardShell.hooks";
import { ContactsTab } from "./tabs/contacts/ContactsTab";
import { ContentTab } from "./tabs/content/ContentTab";
import { MediaTab } from "./tabs/media/MediaTab";
import { OverviewTab } from "./tabs/overview/OverviewTab";
import { PagesTab } from "./tabs/pages/PagesTab";
import { SettingsTab } from "./tabs/settings/SettingsTab";

export function DashboardShell() {
  const {
    activeTab,
    setActiveTab,
    metrics,
    pages,
    contacts,
    sections,
    mediaAssets,
    currentUserEmail,
    isMobileNavOpen,
    toggleMobileNav,
    closeMobileNav,
    handleLogout,

    // Modals & Row Actions
    isPageModalOpen,
    pageToEdit,
    openCreatePage,
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

    // Media Actions
    isMediaPickerOpen,
    openMediaPicker,
    closeMediaPicker,
    handleDeleteMedia,

    // Contacts Actions
    handleToggleContactRead,
    handleDeleteContact,
    getContactRowActions,
  } = useDashboardShell();

  const renderTabIcon = (tabId: DashboardTabId) => {
    switch (tabId) {
      case "overview":
        return <IoGridOutline className="w-4 h-4" aria-hidden="true" />;
      case "pages":
        return <IoDocumentTextOutline className="w-4 h-4" aria-hidden="true" />;
      case "content":
        return <IoLayersOutline className="w-4 h-4" aria-hidden="true" />;
      case "media":
        return <IoImageOutline className="w-4 h-4" aria-hidden="true" />;
      case "contacts":
        return <IoMailOutline className="w-4 h-4" aria-hidden="true" />;
      case "settings":
        return <IoSettingsOutline className="w-4 h-4" aria-hidden="true" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--ink-900)] text-[var(--paper)]">
      {/* Top Header Telemetry Strip */}
      <header className="sticky top-0 z-40 w-full bg-[var(--ink-850)]/95 backdrop-blur-md border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Live Sync Status */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Toggle navigation drawer"
              onClick={toggleMobileNav}
              className="lg:hidden p-2 rounded-lg text-[var(--mist)] hover:text-[var(--paper)] bg-[var(--ink-800)] border border-[var(--line)]"
            >
              {isMobileNavOpen ? (
                <IoCloseOutline className="w-5 h-5" aria-hidden="true" />
              ) : (
                <IoMenuOutline className="w-5 h-5" aria-hidden="true" />
              )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-[var(--paper)]">
                  {DASHBOARD_COPY.TITLE}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[var(--ink-800)] border border-[var(--line)] text-[9px] font-mono uppercase tracking-widest text-[var(--amber)]">
                  {DASHBOARD_COPY.BADGE}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-[var(--live)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--live)] animate-pulse" />
                <span className="uppercase tracking-wider">
                  {DASHBOARD_COPY.LIVE_SYNC_ACTIVE} &bull; {DASHBOARD_COPY.STATUS_ONLINE}
                </span>
              </div>
            </div>
          </div>

          {/* Session Info & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--ink-800)] border border-[var(--line)] text-[11px] font-mono text-[var(--cyan)]">
              <IoShieldCheckmarkOutline
                className="w-3.5 h-3.5 text-[var(--amber)]"
                aria-hidden="true"
              />
              <span className="truncate max-w-[180px]">
                {currentUserEmail || "sachin.shakya@live.com"}
              </span>
            </div>

            <a
              href="/#top"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono text-[var(--mist-dim)] hover:text-[var(--paper)] hover:bg-[var(--ink-800)] border border-transparent hover:border-[var(--line)] transition-colors"
            >
              <IoArrowBackOutline className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{DASHBOARD_COPY.RETURN_TO_SITE}</span>
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--ink-800)] hover:bg-[var(--ink-700)] text-xs font-mono text-[var(--mist)] hover:text-red-400 border border-[var(--line)] transition-colors cursor-pointer"
            >
              <IoLogOutOutline className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{DASHBOARD_COPY.LOGOUT}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Left Navigation Rail (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <nav className="sticky top-24 space-y-1.5 p-2 bg-[var(--ink-850)] border border-[var(--line)] rounded-2xl">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[var(--mist-dim)] border-b border-[var(--line)] mb-2">
              Navigation Modules
            </div>

            {DASHBOARD_NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              let badgeValue: number | string | null = null;
              if (tab.id === "pages") badgeValue = metrics.pageCount;
              if (tab.id === "media") badgeValue = metrics.mediaCount;
              if (tab.id === "contacts") badgeValue = metrics.inquiryCount;
              if (tab.id === "settings") badgeValue = metrics.adminCount;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-colors cursor-pointer text-left ${
                    isActive
                      ? "bg-[var(--ink-700)] text-[var(--amber)] border border-[var(--amber)]/30 font-semibold"
                      : "text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--ink-800)] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {renderTabIcon(tab.id)}
                    <span>{tab.label}</span>
                  </div>

                  {badgeValue !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] tabular-nums font-mono border ${
                        isActive
                          ? "bg-[var(--amber)]/10 border-[var(--amber)]/30 text-[var(--amber)]"
                          : "bg-[var(--ink-800)] border-[var(--line)] text-[var(--mist-dim)]"
                      }`}
                    >
                      {badgeValue}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Drawer Overlay */}
        {isMobileNavOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation overlay"
              onClick={closeMobileNav}
              className="fixed inset-0 z-50 lg:hidden bg-[var(--ink-900)]/80 backdrop-blur-sm cursor-default"
            />
            <div className="fixed inset-y-0 left-0 z-50 w-72 h-full bg-[var(--ink-850)] border-r border-[var(--line)] p-4 space-y-2 animate-fade-in lg:hidden">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--line)] mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--paper)]">
                  Admin Modules
                </span>
                <button
                  type="button"
                  onClick={closeMobileNav}
                  className="p-1 rounded-lg text-[var(--mist)] hover:text-[var(--paper)]"
                >
                  <IoCloseOutline className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {DASHBOARD_NAV_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-colors text-left ${
                    activeTab === tab.id
                      ? "bg-[var(--ink-700)] text-[var(--amber)] border border-[var(--amber)]/30 font-semibold"
                      : "text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--ink-800)]"
                  }`}
                >
                  {renderTabIcon(tab.id)}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Central Content Canvas */}
        <main className="flex-1 min-w-0">
          {activeTab === "overview" && (
            <OverviewTab
              metrics={metrics}
              pages={pages}
              onSelectTab={setActiveTab}
              getPageRowActions={getPageRowActions}
              onOpenTelemetry={openTelemetryModal}
            />
          )}

          {activeTab === "pages" && (
            <PagesTab
              pages={pages}
              onNewPage={openCreatePage}
              getPageRowActions={getPageRowActions}
            />
          )}

          {activeTab === "content" && (
            <ContentTab
              sections={sections}
              onEditSection={openEditSection}
              onMoveSection={handleMoveSection}
              onToggleVisibility={handleToggleSectionVisibility}
              onOpenTelemetry={openTelemetryModal}
            />
          )}

          {activeTab === "media" && (
            <MediaTab
              mediaAssets={mediaAssets}
              onOpenMediaPicker={openMediaPicker}
              onDeleteMedia={handleDeleteMedia}
            />
          )}

          {activeTab === "contacts" && (
            <ContactsTab
              contacts={contacts}
              getContactRowActions={getContactRowActions}
              onToggleRead={handleToggleContactRead}
              onDeleteContact={handleDeleteContact}
            />
          )}

          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>

      {/* Content Management Modals */}
      <PageEditorModal isOpen={isPageModalOpen} pageToEdit={pageToEdit} onClose={closePageModal} />

      <SectionEditorModal
        isOpen={isSectionModalOpen}
        sectionToEdit={sectionToEdit}
        pageId={sectionToEdit?.pageId || "home"}
        onClose={closeSectionModal}
      />

      <TelemetryEditorModal isOpen={isTelemetryModalOpen} onClose={closeTelemetryModal} />

      <MediaPicker isOpen={isMediaPickerOpen} onClose={closeMediaPicker} />
    </div>
  );
}

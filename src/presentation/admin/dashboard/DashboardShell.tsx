// presentation/admin/dashboard/DashboardShell.tsx
// Professional Admin Dashboard Shell (DIIRA Parity Architecture).
// Pinned collapsible desktop sidebar, iOS-style liquid-glass mobile dock, and modular tabs.
// Shadow-free surfaces with hairline borders and zero emojis (Rule 13).

import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCloseOutline,
  IoDocumentTextOutline,
  IoGridOutline,
  IoImageOutline,
  IoLayersOutline,
  IoLogOutOutline,
  IoMailOutline,
  IoMenuOutline,
  IoOpenOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { ThemeToggle } from "../../theme/toggle/ThemeToggle";
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
    isCollapsed,
    toggleSidebarCollapsed,
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
        return <IoGridOutline className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case "pages":
        return <IoDocumentTextOutline className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case "content":
        return <IoLayersOutline className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case "media":
        return <IoImageOutline className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case "contacts":
        return <IoMailOutline className="w-4 h-4 shrink-0" aria-hidden="true" />;
      case "settings":
        return <IoSettingsOutline className="w-4 h-4 shrink-0" aria-hidden="true" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--ink-900)] text-[var(--paper)]">
      {/* Top Header Bar (DIIRA Parity) */}
      <header className="sticky top-0 z-40 w-full bg-[var(--ink-850)]/95 backdrop-blur-md border-b border-[var(--line)]">
        <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Left: Mobile Drawer Button & Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Toggle navigation drawer"
              onClick={toggleMobileNav}
              className="md:hidden p-2 rounded-lg text-[var(--mist)] hover:text-[var(--paper)] bg-[var(--ink-800)] border border-[var(--line)] cursor-pointer"
            >
              {isMobileNavOpen ? (
                <IoCloseOutline className="w-4 h-4" aria-hidden="true" />
              ) : (
                <IoMenuOutline className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            <a href="/admin" className="flex items-center gap-2 select-none">
              <span className="font-bold text-sm tracking-tight text-[var(--paper)] uppercase">
                SACHIN SHAKYA{" "}
                <span className="text-[var(--cyan)] font-normal text-xs lowercase">/ console</span>
              </span>
            </a>
          </div>

          {/* Right: Theme Toggle, View Public Site, User Badge, Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <a
              href="/#top"
              target="_blank"
              rel="noopener noreferrer"
              title="Open Public Website"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--ink-800)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--line-soft)] text-xs font-mono transition-colors"
            >
              <IoOpenOutline className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Public Site</span>
            </a>

            {currentUserEmail && (
              <div className="hidden md:flex items-center px-2.5 py-1 rounded-lg border border-[var(--line)] bg-[var(--ink-800)] text-xs font-mono text-[var(--cyan)] truncate max-w-[180px]">
                {currentUserEmail}
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              title="Log Out"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--ink-800)] text-[var(--mist)] hover:text-red-400 hover:border-red-500/30 text-xs font-mono transition-colors cursor-pointer"
            >
              <IoLogOutOutline className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{DASHBOARD_COPY.LOGOUT}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Content Canvas */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar (Pinned Full Height) */}
        <aside
          aria-label="Administration Navigation"
          className={`hidden md:flex flex-col border-r border-[var(--line)] bg-[var(--ink-850)] transition-all duration-200 sticky top-14 h-[calc(100vh-3.5rem)] self-start shrink-0 ${
            isCollapsed ? "w-16" : "w-60"
          }`}
        >
          {/* Navigation Items */}
          <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
            {DASHBOARD_NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              let badgeValue: number | null = null;
              if (tab.id === "pages") badgeValue = metrics.pageCount;
              if (tab.id === "media") badgeValue = metrics.mediaCount;
              if (tab.id === "contacts") badgeValue = metrics.inquiryCount;
              if (tab.id === "settings") badgeValue = metrics.adminCount;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  title={isCollapsed ? tab.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono transition-colors cursor-pointer text-left ${
                    isActive
                      ? "bg-[var(--ink-700)] text-[var(--amber)] border border-[var(--amber)]/30 font-semibold"
                      : "text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--ink-800)] border border-transparent"
                  } ${isCollapsed ? "justify-center px-0" : "justify-between"}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {renderTabIcon(tab.id)}
                    {!isCollapsed && <span className="truncate">{tab.label}</span>}
                  </div>

                  {!isCollapsed && badgeValue !== null && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] tabular-nums font-mono border ${
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

          {/* Collapse Toggle Footer */}
          <div className="p-2 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              className="w-full flex items-center justify-center p-2 rounded-xl text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--ink-800)] transition-colors text-xs font-mono cursor-pointer"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <IoChevronForwardOutline className="w-4 h-4" />
              ) : (
                <div className="flex items-center gap-2">
                  <IoChevronBackOutline className="w-4 h-4" />
                  <span>Collapse</span>
                </div>
              )}
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer (Backdrop + Panel) */}
        {isMobileNavOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation overlay"
              onClick={closeMobileNav}
              className="fixed inset-0 z-50 md:hidden bg-[var(--ink-900)]/80 backdrop-blur-sm cursor-default"
            />
            <div className="fixed inset-y-0 left-0 z-50 w-72 h-full bg-[var(--ink-850)] border-r border-[var(--line)] p-4 space-y-2 animate-fade-in md:hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[var(--line)] mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--paper)]">
                    Admin Modules
                  </span>
                  <button
                    type="button"
                    onClick={closeMobileNav}
                    className="p-1 rounded-lg text-[var(--mist)] hover:text-[var(--paper)] cursor-pointer"
                  >
                    <IoCloseOutline className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-1">
                  {DASHBOARD_NAV_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        closeMobileNav();
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-colors text-left cursor-pointer ${
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
              </div>

              <div className="pt-4 border-t border-[var(--line)]">
                <a
                  href="/#top"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] mb-2"
                >
                  <IoOpenOutline className="w-4 h-4" />
                  <span>View Public Site</span>
                </a>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-950/30 text-xs font-mono text-red-400 border border-red-500/30 cursor-pointer"
                >
                  <IoLogOutOutline className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Central Content Canvas */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-28 md:pb-8 overflow-y-auto">
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

      {/* Mobile Bottom Navigation Dock (iOS Native App Feel) */}
      <nav
        aria-label="Mobile Navigation Dock"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--ink-850)]/95 backdrop-blur-xl border-t border-[var(--line)] px-2 py-1.5 pb-safe flex items-center justify-around select-none"
      >
        {DASHBOARD_NAV_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
                isActive
                  ? "text-[var(--amber)] bg-[var(--ink-800)] border border-[var(--amber)]/30 font-semibold"
                  : "text-[var(--mist-dim)] hover:text-[var(--paper)]"
              }`}
            >
              {renderTabIcon(tab.id)}
              <span className="text-[9px] font-mono tracking-tight mt-0.5 capitalize">
                {tab.id === "content" ? "Sections" : tab.label}
              </span>
            </button>
          );
        })}
      </nav>

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

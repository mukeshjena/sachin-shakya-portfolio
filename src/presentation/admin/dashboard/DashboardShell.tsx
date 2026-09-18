// presentation/admin/dashboard/DashboardShell.tsx
// Executive Instrument Panel Admin Dashboard Shell.
// Shadow-free surfaces with hairline borders and zero emojis.
// All logic, realtime listeners, and tab state live in DashboardShell.hooks.ts (Rule 13).

import {
  IoArrowBackOutline,
  IoCloseOutline,
  IoDocumentTextOutline,
  IoGridOutline,
  IoLayersOutline,
  IoLogOutOutline,
  IoMailOutline,
  IoMenuOutline,
  IoPulseOutline,
  IoSettingsOutline,
  IoShieldCheckmarkOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import { ThreeDotMenu } from "../../shared/menu/ThreeDotMenu";
import type { MenuItemAction } from "../../shared/menu/ThreeDotMenu.types";
import { AuthorizedEmailsManager } from "../authorization/AuthorizedEmailsManager";
import {
  DASHBOARD_COPY,
  DASHBOARD_NAV_TABS,
  type DashboardTabId,
} from "./constants/dashboard.constants";
import { useDashboardShell } from "./DashboardShell.hooks";

export function DashboardShell() {
  const {
    activeTab,
    setActiveTab,
    metrics,
    pages,
    contacts,
    currentUserEmail,
    isMobileNavOpen,
    toggleMobileNav,
    closeMobileNav,
    handleLogout,
  } = useDashboardShell();

  const renderTabIcon = (tabId: DashboardTabId) => {
    switch (tabId) {
      case "overview":
        return <IoGridOutline className="w-4 h-4" aria-hidden="true" />;
      case "pages":
        return <IoDocumentTextOutline className="w-4 h-4" aria-hidden="true" />;
      case "content":
        return <IoLayersOutline className="w-4 h-4" aria-hidden="true" />;
      case "contacts":
        return <IoMailOutline className="w-4 h-4" aria-hidden="true" />;
      case "settings":
        return <IoSettingsOutline className="w-4 h-4" aria-hidden="true" />;
    }
  };

  const getPageRowActions = (pageId: string, slug: string): MenuItemAction[] => [
    {
      id: `edit-${pageId}`,
      label: "Edit Page",
      onClick: () => {
        window.location.hash = `#/admin/pages/${pageId}`;
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
      id: `duplicate-${pageId}`,
      label: "Duplicate",
      onClick: () => {
        alert(`Duplicate action queued for page: ${slug}`);
      },
    },
    {
      id: `delete-${pageId}`,
      label: "Delete Page",
      danger: true,
      onClick: () => {
        if (slug === "home") {
          alert("The root home page cannot be deleted.");
          return;
        }
        confirm(`Are you sure you want to delete page '/${slug}'?`);
      },
    },
  ];

  const getContactRowActions = (contactId: string, email?: string): MenuItemAction[] => [
    {
      id: `view-${contactId}`,
      label: "View Submission",
      onClick: () => {
        alert(`Viewing consultation inquiry #${contactId}`);
      },
    },
    {
      id: `copy-email-${contactId}`,
      label: "Copy Email",
      onClick: () => {
        if (email) {
          navigator.clipboard.writeText(email);
        }
      },
    },
    {
      id: `delete-${contactId}`,
      label: "Delete Inquiry",
      danger: true,
      onClick: () => {
        confirm("Delete this submission record?");
      },
    },
  ];

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
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Telemetry Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)]">
                      {DASHBOARD_COPY.KPI_PAGES_LABEL}
                    </span>
                    <IoDocumentTextOutline
                      className="w-4 h-4 text-[var(--cyan)]"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-2 text-2xl font-mono font-bold tabular-nums text-[var(--paper)]">
                    {metrics.pageCount}
                  </div>
                  <div className="mt-1 text-[10px] font-mono text-[var(--mist)]">
                    Active dynamic routes
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)]">
                      {DASHBOARD_COPY.KPI_INQUIRIES_LABEL}
                    </span>
                    <IoMailOutline className="w-4 h-4 text-[var(--live)]" aria-hidden="true" />
                  </div>
                  <div className="mt-2 text-2xl font-mono font-bold tabular-nums text-[var(--paper)]">
                    {metrics.inquiryCount}
                  </div>
                  <div className="mt-1 text-[10px] font-mono text-[var(--mist)]">
                    Contact & promo leads
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)]">
                      {DASHBOARD_COPY.KPI_ADMINS_LABEL}
                    </span>
                    <IoShieldCheckmarkOutline
                      className="w-4 h-4 text-[var(--amber)]"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-2 text-2xl font-mono font-bold tabular-nums text-[var(--paper)]">
                    {metrics.adminCount}
                  </div>
                  <div className="mt-1 text-[10px] font-mono text-[var(--mist)]">
                    Delegated co-architects
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)]">
                      {DASHBOARD_COPY.KPI_FINOPS_LABEL}
                    </span>
                    <IoTrendingUpOutline
                      className="w-4 h-4 text-[var(--amber)]"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-2 text-2xl font-mono font-bold tabular-nums text-[var(--amber)]">
                    {DASHBOARD_COPY.FINOPS_AMOUNT}
                  </div>
                  <div className="mt-1 text-[10px] font-mono text-[var(--mist)]">
                    Documented enterprise ROI
                  </div>
                </div>
              </div>

              {/* Realtime Fleet Status Banner */}
              <div className="p-4 rounded-xl bg-[var(--ink-850)] border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-[var(--live)]">
                  <IoPulseOutline className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>
                    Realtime telemetry active &bull; IndexedDB multi-tab cache synchronized
                  </span>
                </div>
                <div className="text-[var(--mist-dim)] text-[11px]">
                  {metrics.lastSyncedAt
                    ? `${DASHBOARD_COPY.LAST_SYNC_LABEL}: ${metrics.lastSyncedAt.toLocaleTimeString()}`
                    : "Connecting to live cloud stream..."}
                </div>
              </div>

              {/* Recent Pages Section with 3-Dot Menus */}
              <div className="p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)]">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--line)] mb-4">
                  <h3 className="text-sm font-bold font-mono tracking-tight text-[var(--paper)] uppercase">
                    Dynamic Pages Telemetry
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("pages")}
                    className="text-xs font-mono text-[var(--cyan)] hover:underline cursor-pointer"
                  >
                    View All Pages &rarr;
                  </button>
                </div>

                <div className="space-y-2">
                  {pages.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] hover:border-[var(--line-soft)] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono font-semibold text-[var(--paper)] truncate">
                          {p.title}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--cyan)] truncate">
                          /{p.slug}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border ${
                            p.isPublished
                              ? "bg-[var(--live)]/10 border-[var(--live)]/30 text-[var(--live)]"
                              : "bg-[var(--ink-700)] border-[var(--line)] text-[var(--mist-dim)]"
                          }`}
                        >
                          {p.isPublished ? "PUBLISHED" : "DRAFT"}
                        </span>
                        <ThreeDotMenu actions={getPageRowActions(p.id, p.slug)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAGES */}
          {activeTab === "pages" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)]">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-[var(--paper)]">
                    Dynamic Page Engine
                  </h3>
                  <p className="text-xs text-[var(--mist)] mt-1">
                    Manage published pages, navigation auto-linking, and section arrangements.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert("New page creation flow starts in Step 23.")}
                  className="px-4 py-2 rounded-xl bg-[var(--amber)] hover:bg-[var(--amber-deep)] text-[var(--ink-900)] text-xs font-mono font-semibold tracking-wide transition-colors cursor-pointer"
                >
                  + New Page
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)] space-y-3">
                {pages.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)]"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[var(--paper)]">{p.title}</div>
                      <div className="text-xs font-mono text-[var(--cyan)] mt-0.5">/{p.slug}</div>
                      <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-[var(--mist-dim)]">
                        <span>Header Nav: {p.showInHeader ? "YES" : "NO"}</span>
                        <span>&bull;</span>
                        <span>Footer Nav: {p.showInFooter ? "YES" : "NO"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                          p.isPublished
                            ? "bg-[var(--live)]/10 border-[var(--live)]/30 text-[var(--live)]"
                            : "bg-[var(--ink-700)] border-[var(--line)] text-[var(--mist-dim)]"
                        }`}
                      >
                        {p.isPublished ? "PUBLISHED" : "DRAFT"}
                      </span>
                      <ThreeDotMenu actions={getPageRowActions(p.id, p.slug)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CONTENT */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)]">
                <h3 className="text-lg font-bold tracking-tight text-[var(--paper)]">
                  Content Management Modules
                </h3>
                <p className="text-xs text-[var(--mist)] mt-1">
                  Reorder and configure Experience, Capabilities, Credentials, and FinOps telemetry
                  sections.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)] space-y-3">
                {[
                  "Impact & FinOps Telemetry",
                  "Experience Timeline",
                  "Cloud Capabilities",
                  "Certifications & Credentials",
                  "Consultation Contact",
                ].map((sectionName, idx) => (
                  <div
                    key={sectionName}
                    className="flex items-center justify-between p-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[var(--ink-700)] border border-[var(--line)] flex items-center justify-center text-xs font-mono text-[var(--cyan)]">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-[var(--paper)]">
                          {sectionName}
                        </div>
                        <div className="text-[10px] font-mono text-[var(--mist-dim)] mt-0.5">
                          Status: ACTIVE &bull; Visible on Home
                        </div>
                      </div>
                    </div>

                    <ThreeDotMenu
                      actions={[
                        {
                          id: `edit-${idx}`,
                          label: "Edit Section Content",
                          onClick: () => alert(`Editing ${sectionName}`),
                        },
                        {
                          id: `hide-${idx}`,
                          label: "Toggle Visibility",
                          onClick: () => alert(`Toggled visibility of ${sectionName}`),
                        },
                        {
                          id: `reorder-${idx}`,
                          label: "Reorder Position",
                          onClick: () => alert(`Reordering ${sectionName}`),
                        },
                      ]}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONTACTS / INQUIRIES */}
          {activeTab === "contacts" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)]">
                <h3 className="text-lg font-bold tracking-tight text-[var(--paper)]">
                  Inbound Consultation Inquiries
                </h3>
                <p className="text-xs text-[var(--mist)] mt-1">
                  Real-time leads from the consultation contact form and promotional popup.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)] space-y-3">
                {contacts.length === 0 ? (
                  <div className="py-12 text-center text-xs font-mono text-[var(--mist-dim)]">
                    No inquiries recorded in contactSubmissions yet.
                  </div>
                ) : (
                  contacts.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)]"
                    >
                      <div className="min-w-0 pr-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-semibold text-[var(--paper)]">
                            {c.name || "Anonymous Lead"}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[var(--ink-700)] border border-[var(--line)] text-[9px] font-mono text-[var(--cyan)] uppercase">
                            {c.source || "contact"}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-[var(--cyan)] mt-1">
                          {c.email || "No email"}
                        </div>
                        {c.company && (
                          <div className="text-[11px] font-mono text-[var(--mist)] mt-0.5">
                            Company: {c.company}
                          </div>
                        )}
                        {c.message && (
                          <p className="text-xs text-[var(--mist)] mt-2 line-clamp-2 leading-relaxed">
                            {c.message}
                          </p>
                        )}
                      </div>

                      <ThreeDotMenu actions={getContactRowActions(c.id, c.email)} />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS & AUTHORIZATION */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <AuthorizedEmailsManager />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

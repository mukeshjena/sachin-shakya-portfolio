// presentation/admin/dashboard/tabs/overview/OverviewTab.tsx
// Overview telemetry summary tab with real-time status and quick action entry points.
// Zero shadows, hairline borders, and zero emojis.

import type React from "react";
import {
  IoDocumentTextOutline,
  IoMailOutline,
  IoPulseOutline,
  IoShieldCheckmarkOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import { ThreeDotMenu } from "../../../../shared/menu/ThreeDotMenu";
import type { MenuItemAction } from "../../../../shared/menu/ThreeDotMenu.types";
import { DASHBOARD_COPY, type DashboardTabId } from "../../constants/dashboard.constants";
import type { DashboardMetrics, DashboardPageItem } from "../../DashboardShell.types";

export interface OverviewTabProps {
  readonly metrics: DashboardMetrics;
  readonly pages: readonly DashboardPageItem[];
  readonly onSelectTab: (tab: DashboardTabId) => void;
  readonly getPageRowActions: (pageId: string, slug: string) => MenuItemAction[];
  readonly onOpenTelemetry: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  metrics,
  pages,
  onSelectTab,
  getPageRowActions,
  onOpenTelemetry,
}) => {
  return (
    <div className="space-y-6">
      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)]">
              {DASHBOARD_COPY.KPI_PAGES_LABEL}
            </span>
            <IoDocumentTextOutline className="w-4 h-4 text-[var(--cyan)]" aria-hidden="true" />
          </div>
          <div className="mt-2 text-2xl font-mono font-bold tabular-nums text-[var(--paper)]">
            {metrics.pageCount}
          </div>
          <div className="mt-1 text-[10px] font-mono text-[var(--mist)]">Active dynamic routes</div>
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
          <div className="mt-1 text-[10px] font-mono text-[var(--mist)]">Contact & promo leads</div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)]">
              {DASHBOARD_COPY.KPI_ADMINS_LABEL}
            </span>
            <IoShieldCheckmarkOutline className="w-4 h-4 text-[var(--amber)]" aria-hidden="true" />
          </div>
          <div className="mt-2 text-2xl font-mono font-bold tabular-nums text-[var(--paper)]">
            {metrics.adminCount}
          </div>
          <div className="mt-1 text-[10px] font-mono text-[var(--mist)]">
            Delegated co-architects
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)]">
                {DASHBOARD_COPY.KPI_FINOPS_LABEL}
              </span>
              <IoTrendingUpOutline className="w-4 h-4 text-[var(--amber)]" aria-hidden="true" />
            </div>
            <div className="mt-2 text-2xl font-mono font-bold tabular-nums text-[var(--amber)]">
              {DASHBOARD_COPY.FINOPS_AMOUNT}
            </div>
            <div className="mt-1 text-[10px] font-mono text-[var(--mist)]">
              Documented enterprise ROI
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenTelemetry}
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-mono text-[var(--cyan)] hover:underline cursor-pointer"
          >
            Configure Spend Benchmarks &rarr;
          </button>
        </div>
      </div>

      {/* Realtime Fleet Status Banner */}
      <div className="p-4 rounded-xl bg-[var(--ink-850)] border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-[var(--live)]">
          <IoPulseOutline className="w-4 h-4 animate-spin" aria-hidden="true" />
          <span>Realtime telemetry active &bull; IndexedDB multi-tab cache synchronized</span>
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
            onClick={() => onSelectTab("pages")}
            className="text-xs font-mono text-[var(--cyan)] hover:underline cursor-pointer"
          >
            View All Pages &rarr;
          </button>
        </div>

        <div className="space-y-2">
          {pages.slice(0, 5).map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] hover:border-[var(--line-soft)] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono font-semibold text-[var(--paper)] truncate">
                  {p.title}
                </span>
                <span className="text-[10px] font-mono text-[var(--cyan)] truncate">/{p.slug}</span>
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
  );
};

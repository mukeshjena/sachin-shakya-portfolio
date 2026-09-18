// presentation/admin/dashboard/tabs/pages/PagesTab.tsx
// Dynamic pages management tab with create/edit/delete integration.
// Zero shadows, hairline borders, and zero emojis.

import type React from "react";
import { ThreeDotMenu } from "../../../../shared/menu/ThreeDotMenu";
import type { MenuItemAction } from "../../../../shared/menu/ThreeDotMenu.types";
import type { DashboardPageItem } from "../../DashboardShell.types";

export interface PagesTabProps {
  readonly pages: readonly DashboardPageItem[];
  readonly onNewPage: () => void;
  readonly getPageRowActions: (pageId: string, slug: string) => MenuItemAction[];
}

export const PagesTab: React.FC<PagesTabProps> = ({ pages, onNewPage, getPageRowActions }) => {
  return (
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
          onClick={onNewPage}
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
  );
};

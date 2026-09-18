// presentation/admin/dashboard/tabs/contacts/ContactsTab.tsx
// Inbound leads and consultation inquiries manager.
// Zero shadows, hairline borders, and zero emojis.

import type React from "react";
import { ThreeDotMenu } from "../../../../shared/menu/ThreeDotMenu";
import type { MenuItemAction } from "../../../../shared/menu/ThreeDotMenu.types";
import type { DashboardContactItem } from "../../DashboardShell.types";

export interface ContactsTabProps {
  readonly contacts: readonly DashboardContactItem[];
  readonly getContactRowActions: (contactId: string, email?: string) => MenuItemAction[];
}

export const ContactsTab: React.FC<ContactsTabProps> = ({ contacts, getContactRowActions }) => {
  return (
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
  );
};

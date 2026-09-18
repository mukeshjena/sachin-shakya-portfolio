// presentation/admin/dashboard/tabs/contacts/ContactsTab.tsx
// Inbound leads and consultation inquiries inbox manager.
// Zero shadows, hairline borders, and zero emojis.
// Filter by All/Unread with one-click status toggling and permanent deletion.

import type React from "react";
import { useMemo, useState } from "react";
import {
  IoCheckmarkDoneOutline,
  IoCheckmarkOutline,
  IoCopyOutline,
  IoFilterOutline,
  IoMailOutline,
  IoMailUnreadOutline,
  IoTimeOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { ThreeDotMenu } from "../../../../shared/menu/ThreeDotMenu";
import type { MenuItemAction } from "../../../../shared/menu/ThreeDotMenu.types";
import type { DashboardContactItem } from "../../DashboardShell.types";

export interface ContactsTabProps {
  readonly contacts: readonly DashboardContactItem[];
  readonly getContactRowActions: (
    contactId: string,
    email?: string,
    isRead?: boolean
  ) => MenuItemAction[];
  readonly onToggleRead: (contactId: string, currentStatus: boolean) => Promise<void>;
  readonly onDeleteContact: (contactId: string) => Promise<void>;
}

type FilterStatus = "all" | "unread";

export const ContactsTab: React.FC<ContactsTabProps> = ({
  contacts,
  getContactRowActions,
  onToggleRead,
  onDeleteContact,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);

  const unreadCount = useMemo(() => contacts.filter((c) => !c.isRead).length, [contacts]);

  const displayedContacts = useMemo(() => {
    if (activeFilter === "unread") {
      return contacts.filter((c) => !c.isRead);
    }
    return contacts;
  }, [contacts, activeFilter]);

  const handleCopyEmail = (contactId: string, email?: string) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmailId(contactId);
    setTimeout(() => {
      setCopiedEmailId(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)] gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--live)]">
              <IoMailOutline className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold tracking-tight text-[var(--paper)]">
              Inbound Leads & Inquiries
            </h3>
          </div>
          <p className="text-xs text-[var(--mist)] mt-1">
            Real-time telemetry leads captured from consultation contact form and promotional
            popups.
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              activeFilter === "all"
                ? "bg-[var(--ink-700)] text-[var(--paper)] font-semibold border border-[var(--line)]"
                : "text-[var(--mist-dim)] hover:text-[var(--paper)]"
            }`}
          >
            All ({contacts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("unread")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeFilter === "unread"
                ? "bg-[var(--ink-700)] text-[var(--amber)] font-semibold border border-[var(--amber)]/30"
                : "text-[var(--mist-dim)] hover:text-[var(--paper)]"
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[var(--amber)]/20 text-[var(--amber)] text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-3">
        {displayedContacts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[var(--ink-850)] border border-[var(--line)]">
            <div className="w-12 h-12 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--mist-dim)] mx-auto mb-3">
              <IoFilterOutline className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-[var(--paper)]">No inquiries found</p>
            <p className="text-xs text-[var(--mist-dim)] font-mono mt-1">
              {activeFilter === "unread"
                ? "All inquiries have been marked as read."
                : "No inquiries recorded in contactSubmissions yet."}
            </p>
          </div>
        ) : (
          displayedContacts.map((c) => {
            const isRead = Boolean(c.isRead);
            const isCopied = copiedEmailId === c.id;

            return (
              <div
                key={c.id}
                className={`p-5 rounded-2xl bg-[var(--ink-850)] border transition-colors ${
                  isRead
                    ? "border-[var(--line)] opacity-85"
                    : "border-[var(--amber)]/30 bg-[var(--ink-850)]"
                }`}
              >
                {/* Lead Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--line-soft)]">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-sm font-bold text-[var(--paper)]">
                      {c.name || "Anonymous Lead"}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border ${
                        isRead
                          ? "bg-[var(--ink-800)] border-[var(--line)] text-[var(--mist-dim)]"
                          : "bg-[var(--amber)]/10 border-[var(--amber)]/30 text-[var(--amber)] font-semibold"
                      }`}
                    >
                      {isRead ? "READ" : "UNREAD"}
                    </span>

                    {/* Source Badge */}
                    <span className="px-2 py-0.5 rounded-full bg-[var(--ink-800)] border border-[var(--line)] text-[9px] font-mono text-[var(--cyan)] uppercase">
                      {c.source || "contact"}
                    </span>
                  </div>

                  {/* Actions & Timestamp */}
                  <div className="flex items-center gap-2">
                    {c.createdAt && (
                      <div className="flex items-center gap-1 text-[11px] font-mono text-[var(--mist-dim)] mr-2">
                        <IoTimeOutline className="w-3.5 h-3.5" />
                        <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}

                    {/* Toggle Read Quick Button */}
                    <button
                      type="button"
                      onClick={() => onToggleRead(c.id, isRead)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
                        isRead
                          ? "bg-[var(--ink-800)] text-[var(--mist-dim)] hover:text-[var(--paper)] border-[var(--line)]"
                          : "bg-[var(--amber)]/10 text-[var(--amber)] hover:bg-[var(--amber)]/20 border-[var(--amber)]/30"
                      }`}
                      title={isRead ? "Mark as unread" : "Mark as read"}
                    >
                      {isRead ? (
                        <>
                          <IoMailUnreadOutline className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Mark Unread</span>
                        </>
                      ) : (
                        <>
                          <IoCheckmarkDoneOutline className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Mark Read</span>
                        </>
                      )}
                    </button>

                    {/* Delete Quick Button */}
                    <button
                      type="button"
                      onClick={() => onDeleteContact(c.id)}
                      className="p-1.5 rounded-lg bg-[var(--ink-800)] text-[var(--mist-dim)] hover:text-red-400 border border-[var(--line)] hover:border-red-500/30 transition-colors cursor-pointer"
                      title="Delete inquiry"
                    >
                      <IoTrashOutline className="w-3.5 h-3.5" />
                    </button>

                    {/* Overflow Menu */}
                    <ThreeDotMenu actions={getContactRowActions(c.id, c.email, isRead)} />
                  </div>
                </div>

                {/* Lead Contact Info */}
                <div className="pt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono">
                  {c.email && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[var(--mist-dim)]">Email:</span>
                      <span className="text-[var(--cyan)]">{c.email}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(c.id, c.email)}
                        className="p-1 text-[var(--mist)] hover:text-[var(--paper)] transition-colors cursor-pointer"
                        title="Copy email"
                      >
                        {isCopied ? (
                          <IoCheckmarkOutline className="w-3.5 h-3.5 text-[var(--live)]" />
                        ) : (
                          <IoCopyOutline className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {c.company && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[var(--mist-dim)]">Company:</span>
                      <span className="text-[var(--paper)] font-medium">{c.company}</span>
                    </div>
                  )}
                </div>

                {/* Lead Message Body */}
                {c.message && (
                  <div className="mt-3 p-3.5 rounded-xl bg-[var(--ink-800)] border border-[var(--line-soft)] text-xs text-[var(--mist)] leading-relaxed whitespace-pre-wrap">
                    {c.message}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

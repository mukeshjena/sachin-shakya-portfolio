// presentation/admin/dashboard/tabs/settings/SettingsTab.tsx
// Tabbed configuration console for Brand Identity, Contact Coordinates, Promo Modal, and Admin Access.
// Zero shadows, hairline borders, outline Cupertino icons, and zero emojis (DIIRA parity).

import type React from "react";
import { useState } from "react";
import {
  IoMegaphoneOutline,
  IoPersonOutline,
  IoShareSocialOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { AuthorizedEmailsManager } from "../../../authorization/AuthorizedEmailsManager";
import { PromoPopupEditor } from "../../../content/promo/PromoPopupEditor";
import { SiteSettingsEditor } from "../../../content/settings/SiteSettingsEditor";

export type SettingsSubTab = "identity" | "contact" | "promo" | "security";

interface SubTabItem {
  readonly id: SettingsSubTab;
  readonly label: string;
  readonly icon: React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  readonly description: string;
}

const SETTINGS_SUBTABS: readonly SubTabItem[] = [
  {
    id: "identity",
    label: "Brand & Identity",
    icon: IoPersonOutline,
    description: "Name, headline, bio, logo & resume",
  },
  {
    id: "contact",
    label: "Contact & Coordinates",
    icon: IoShareSocialOutline,
    description: "Email, phone, location & social profiles",
  },
  {
    id: "promo",
    label: "Consultation Popup",
    icon: IoMegaphoneOutline,
    description: "Advisory lead modal trigger & frequency",
  },
  {
    id: "security",
    label: "Admin Access",
    icon: IoShieldCheckmarkOutline,
    description: "Whitelisted administrator accounts",
  },
];

export const SettingsTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SettingsSubTab>("identity");

  return (
    <div className="space-y-6">
      {/* Sub-Tab Navigation Strip */}
      <div className="p-1.5 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {SETTINGS_SUBTABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? "bg-[var(--ink-800)] text-[var(--amber)] border border-[var(--line)]"
                  : "text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--ink-800)]/50 border border-transparent"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? "text-[var(--amber)]" : "text-[var(--mist-dim)]"}`}
                aria-hidden="true"
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Sub-Tab Canvas */}
      <div>
        {activeSubTab === "identity" && <SiteSettingsEditor subTab="identity" />}

        {activeSubTab === "contact" && <SiteSettingsEditor subTab="contact" />}

        {activeSubTab === "promo" && (
          <div className="w-full">
            <PromoPopupEditor />
          </div>
        )}

        {activeSubTab === "security" && (
          <div className="w-full">
            <AuthorizedEmailsManager />
          </div>
        )}
      </div>
    </div>
  );
};

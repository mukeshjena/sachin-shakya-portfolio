// presentation/admin/dashboard/tabs/settings/SettingsTab.tsx
// Unified settings tab rendering Authorized Emails and Site Settings.
// Zero shadows, hairline borders, and zero emojis.

import type React from "react";
import { AuthorizedEmailsManager } from "../../../authorization/AuthorizedEmailsManager";
import { PromoPopupEditor } from "../../../content/promo/PromoPopupEditor";
import { SiteSettingsEditor } from "../../../content/settings/SiteSettingsEditor";

export const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Promo Popup Advisory Configuration */}
      <section>
        <PromoPopupEditor />
      </section>

      {/* Site Identity & Metadata Configuration */}
      <section>
        <SiteSettingsEditor />
      </section>

      {/* Multi-Admin Whitelist Authorization */}
      <section>
        <AuthorizedEmailsManager />
      </section>
    </div>
  );
};

// presentation/admin/dashboard/tabs/settings/SettingsTab.tsx
// Unified settings tab rendering Authorized Emails and Site Settings.
// Zero shadows, hairline borders, and zero emojis.

import type React from "react";
import { AuthorizedEmailsManager } from "../../../authorization/AuthorizedEmailsManager";
import { SiteSettingsEditor } from "../../../content/settings/SiteSettingsEditor";

export const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-8">
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

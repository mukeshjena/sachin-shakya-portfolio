// presentation/providers/site-config/siteConfigContext.ts
// Context definition for global site configuration.

import { createContext } from "react";
import type { SiteSettings } from "../../../domain/entities/admin/SiteSettings";
import { DEFAULT_SITE_SETTINGS } from "./constants/siteConfig.constants";

export interface SiteConfigContextValue {
  readonly siteSettings: SiteSettings;
  readonly loading: boolean;
  readonly error: Error | null;
}

export const SiteConfigContext = createContext<SiteConfigContextValue>({
  siteSettings: DEFAULT_SITE_SETTINGS,
  loading: true,
  error: null,
});

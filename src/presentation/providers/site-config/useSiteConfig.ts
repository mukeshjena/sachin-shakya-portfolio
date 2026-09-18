// presentation/providers/site-config/useSiteConfig.ts
// Consumer hook for global site configuration.

import { useContext } from "react";
import { SiteConfigContext, type SiteConfigContextValue } from "./siteConfigContext";

export function useSiteConfig(): SiteConfigContextValue {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error("[useSiteConfig] Hook must be used within a <SiteConfigProvider>");
  }
  return context;
}

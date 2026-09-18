// presentation/shell/mobile-header/MobileHeader.hooks.ts
// Hook managing state for mobile top app bar.

import { useSiteConfig } from "../../providers/site-config/useSiteConfig";
import type { MobileHeaderState } from "./MobileHeader.types";

export function useMobileHeaderLogic(): MobileHeaderState {
  const { siteSettings } = useSiteConfig();

  return {
    logoUrl: siteSettings.logoUrl,
    fullName: siteSettings.fullName || "SACHIN SHAKYA",
    isAvailable: siteSettings.availabilityStatus === "available",
  };
}

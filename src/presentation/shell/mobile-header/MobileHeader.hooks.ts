// presentation/shell/mobile-header/MobileHeader.hooks.ts
// Hook managing state for mobile top app bar.

import { useEffect, useState } from "react";
import { useSiteConfig } from "../../providers/site-config/useSiteConfig";
import type { MobileHeaderState } from "./MobileHeader.types";

export function useMobileHeaderLogic(): MobileHeaderState {
  const { siteSettings } = useSiteConfig();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return {
    logoUrl: siteSettings.logoUrl,
    fullName: siteSettings.fullName || "SACHIN SHAKYA",
    isAvailable: siteSettings.availabilityStatus === "available",
    isScrolled,
  };
}

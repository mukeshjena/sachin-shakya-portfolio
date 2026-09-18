// presentation/shell/footer/Footer.hooks.ts
// Lifecycle and state logic for the universal Footer component.
// Adheres strictly to Universal Separation of Concerns (Rule 13).

import { useEffect, useMemo, useState } from "react";
import type { IGetFooterNavPagesUseCase } from "../../../application/use-cases/pages/GetFooterNavPagesUseCase";
import { DI_TOKENS } from "../../../infrastructure/di/tokens";
import { useSiteConfig } from "../../providers/site-config/useSiteConfig";
import { useContainer } from "../../shared/useContainer";
import { FOOTER_DEFAULT_SECTION_LINKS } from "./constants/footer.constants";
import type { FooterNavItem, FooterState } from "./Footer.types";

export function useFooterLogic(): FooterState {
  const { siteSettings } = useSiteConfig();
  const getFooterNavUseCase = useContainer<IGetFooterNavPagesUseCase>(DI_TOKENS.GetFooterNavPages);

  const [dynamicPages, setDynamicPages] = useState<readonly FooterNavItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchFooterPages() {
      try {
        const pages = await getFooterNavUseCase.execute();
        if (isMounted && pages.length > 0) {
          const mapped: FooterNavItem[] = pages
            .filter((p) => p.slug.toString() !== "home")
            .map((p) => ({
              id: p.id,
              label: p.title,
              href: `/${p.slug.toString()}`,
            }));
          setDynamicPages(mapped);
        }
      } catch (err) {
        console.error("[useFooterLogic] Failed to fetch footer nav pages:", err);
      }
    }

    fetchFooterPages();

    return () => {
      isMounted = false;
    };
  }, [getFooterNavUseCase]);

  const navItems = useMemo<readonly FooterNavItem[]>(() => {
    return [...FOOTER_DEFAULT_SECTION_LINKS, ...dynamicPages];
  }, [dynamicPages]);

  return {
    currentYear: new Date().getFullYear(),
    fullName: siteSettings.fullName || "Sachin Shakya",
    headline: siteSettings.headline || "Lead Cloud Architect & DevOps Consultant",
    email: siteSettings.email || "sachin.shakya@live.com",
    location: siteSettings.location || "Faridabad, Haryana, India",
    resumePdfUrl: siteSettings.resumePdfUrl,
    socialLinks: siteSettings.socialLinks ?? [],
    navItems,
  };
}

// presentation/shell/header/Header.hooks.ts
// State and lifecycle logic for desktop Header.
// Adheres strictly to Universal Separation of Concerns (Rule 13).

import { useEffect, useMemo, useState } from "react";
import type { IGetHeaderNavPagesUseCase } from "../../../application/use-cases/pages/GetHeaderNavPagesUseCase";
import { DI_TOKENS } from "../../../infrastructure/di/tokens";
import { useSiteConfig } from "../../providers/site-config/useSiteConfig";
import { useContainer } from "../../shared/useContainer";
import {
  DEFAULT_HEADER_SECTION_LINKS,
  HEADER_COPY,
  type NavLinkItem,
} from "./constants/header.constants";
import type { HeaderState } from "./Header.types";

export function useHeaderLogic(): HeaderState {
  const { siteSettings } = useSiteConfig();
  const getHeaderNavUseCase = useContainer<IGetHeaderNavPagesUseCase>(DI_TOKENS.GetHeaderNavPages);

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [dynamicPages, setDynamicPages] = useState<readonly NavLinkItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchNavPages() {
      try {
        const pages = await getHeaderNavUseCase.execute();
        if (isMounted && pages.length > 0) {
          // Map pages that are not 'home' to custom nav links
          const pageLinks: NavLinkItem[] = pages
            .filter((p) => p.slug.toString() !== "home")
            .map((p) => ({
              id: p.id,
              label: p.title,
              href: `/${p.slug.toString()}`,
              isAnchor: false,
            }));
          setDynamicPages(pageLinks);
        }
      } catch (err) {
        console.error("[useHeaderLogic] Failed to load dynamic nav pages:", err);
      }
    }

    fetchNavPages();

    return () => {
      isMounted = false;
    };
  }, [getHeaderNavUseCase]);

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

  const navLinks = useMemo<readonly NavLinkItem[]>(() => {
    return [...DEFAULT_HEADER_SECTION_LINKS, ...dynamicPages];
  }, [dynamicPages]);

  return {
    isScrolled,
    logoUrl: siteSettings.logoUrl,
    fullName: siteSettings.fullName || HEADER_COPY.brandTitle,
    availabilityStatus: siteSettings.availabilityStatus,
    availabilityNote: siteSettings.availabilityNote || HEADER_COPY.availabilityDefault,
    navLinks,
    resumePdfUrl: siteSettings.resumePdfUrl,
  };
}

// presentation/shell/header/Header.hooks.ts
// State and lifecycle logic for desktop Header.
// Adheres strictly to Universal Separation of Concerns (Rule 13).

import { useEffect, useMemo, useState } from "react";
import type { IGetHeaderNavPagesUseCase } from "../../../application/use-cases/pages/nav/GetHeaderNavPagesUseCase";
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
          // Map pages that are not 'home' to custom nav links, strictly excluding FinOps & Architecture duplicates
          const pageLinks: NavLinkItem[] = pages
            .filter((p) => {
              const slug = p.slug.toString().toLowerCase();
              const title = p.title.toLowerCase();
              return (
                slug !== "home" &&
                slug !== "cloud-architecture" &&
                !title.includes("finops") &&
                !title.includes("architecture & finops") &&
                !title.includes("enterprise cloud architecture")
              );
            })
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

  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Identify currently visible section
      const sectionMapping: Record<string, string> = {
        contact: "contact",
        credentials: "credentials",
        capabilities: "capabilities",
        experience: "experience",
        overview: "overview",
        impact: "overview",
        metrics: "metrics",
        telemetry: "metrics",
      };
      const sectionIds = [
        "contact",
        "credentials",
        "capabilities",
        "experience",
        "overview",
        "impact",
        "metrics",
        "telemetry",
      ];
      const scrollPos = window.scrollY + 180;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(sectionMapping[id] || id);
            return;
          }
        }
      }

      if (window.scrollY < 200) {
        setActiveSection("");
      }
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
    activeSection,
  };
}

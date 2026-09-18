// presentation/overview/ExecutiveOverview.hooks.ts
// Lifecycle and data resolution for the ExecutiveOverview section.
// Universal Separation of Concerns (Rule 13).

import { useEffect, useMemo, useState } from "react";
import type { GetPublishedPageBySlugUseCase } from "../../application/use-cases/pages/GetPublishedPageBySlugUseCase";
import { DI_TOKENS } from "../../infrastructure/di/tokens";
import { useSiteConfig } from "../providers/site-config/useSiteConfig";
import { useContainer } from "../shared/useContainer";
import { OVERVIEW_FALLBACK_CONTENT } from "./constants/overview.constants";
import type { ExecutiveOverviewState, OverviewContentData } from "./ExecutiveOverview.types";

interface OverviewSectionContent {
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly subheadline?: string;
  readonly ctaPrimary?: string;
  readonly ctaSecondary?: string;
  readonly heroPhotoUrl?: string;
}

export function useExecutiveOverviewLogic(): ExecutiveOverviewState {
  const { siteSettings } = useSiteConfig();
  const getPageUseCase = useContainer<GetPublishedPageBySlugUseCase>(
    DI_TOKENS.GetPublishedPageBySlug
  );

  const [sectionData, setSectionData] = useState<OverviewSectionContent | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOverviewContent() {
      try {
        const homePage = await getPageUseCase.execute("home");
        if (isMounted && homePage) {
          setSectionData({
            eyebrow: OVERVIEW_FALLBACK_CONTENT.eyebrow,
            headline: OVERVIEW_FALLBACK_CONTENT.headline,
            subheadline: OVERVIEW_FALLBACK_CONTENT.subheadline,
            ctaPrimary: OVERVIEW_FALLBACK_CONTENT.ctaPrimary,
            ctaSecondary: OVERVIEW_FALLBACK_CONTENT.ctaSecondary,
            heroPhotoUrl: siteSettings.avatarUrl || "/assets/sachin-one.png",
          });
        }
      } catch (err) {
        console.error("[useExecutiveOverviewLogic] Failed to fetch overview content:", err);
      }
    }

    loadOverviewContent();

    return () => {
      isMounted = false;
    };
  }, [getPageUseCase, siteSettings.avatarUrl]);

  const content = useMemo<OverviewContentData>(() => {
    return {
      eyebrow: sectionData?.eyebrow ?? OVERVIEW_FALLBACK_CONTENT.eyebrow,
      headline: sectionData?.headline ?? OVERVIEW_FALLBACK_CONTENT.headline,
      subheadline: sectionData?.subheadline ?? OVERVIEW_FALLBACK_CONTENT.subheadline,
      ctaPrimary: sectionData?.ctaPrimary ?? OVERVIEW_FALLBACK_CONTENT.ctaPrimary,
      ctaSecondary: sectionData?.ctaSecondary ?? OVERVIEW_FALLBACK_CONTENT.ctaSecondary,
      heroPhotoUrl: sectionData?.heroPhotoUrl ?? siteSettings.avatarUrl ?? "/assets/sachin-one.png",
      resumePdfUrl: siteSettings.resumePdfUrl,
    };
  }, [sectionData, siteSettings.avatarUrl, siteSettings.resumePdfUrl]);

  return { content };
}

// presentation/hero/BlackholeHero.hooks.ts
// Lifecycle, data fetching, Three.js initialization, and performance guards for the Sci-Fi Hero.
// Adheres strictly to Universal Separation of Concerns (Rule 13).

import { useEffect, useMemo, useRef, useState } from "react";
import type { GetPublishedPageBySlugUseCase } from "../../application/use-cases/pages/GetPublishedPageBySlugUseCase";
import { DI_TOKENS } from "../../infrastructure/di/tokens";
import { useSiteConfig } from "../providers/site-config/useSiteConfig";
import { useContainer } from "../shared/useContainer";
import type { BlackholeHeroState, HeroContentData } from "./BlackholeHero.types";
import { HERO_FALLBACK_CONTENT } from "./constants/hero.constants";
import { BlackholeSceneController } from "./scene/BlackholeHero.scene";

interface HeroSectionContent {
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly subheadline?: string;
  readonly ctaPrimary?: string;
  readonly ctaSecondary?: string;
  readonly heroPhotoUrl?: string;
}

export function useBlackholeHeroLogic(): BlackholeHeroState {
  const { siteSettings } = useSiteConfig();
  const getPageUseCase = useContainer<GetPublishedPageBySlugUseCase>(
    DI_TOKENS.GetPublishedPageBySlug
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const [sectionData, setSectionData] = useState<HeroSectionContent | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  // 1. Fetch home page hero section from Firestore
  useEffect(() => {
    let isMounted = true;

    async function loadHeroContent() {
      try {
        const homePage = await getPageUseCase.execute("home");
        if (isMounted && homePage) {
          // In Step 16 full section fetching is plugged in; for now, we read from seeded page/media
          setSectionData({
            eyebrow: HERO_FALLBACK_CONTENT.eyebrow,
            headline: HERO_FALLBACK_CONTENT.headline,
            subheadline: HERO_FALLBACK_CONTENT.subheadline,
            ctaPrimary: HERO_FALLBACK_CONTENT.ctaPrimary,
            ctaSecondary: HERO_FALLBACK_CONTENT.ctaSecondary,
            heroPhotoUrl: siteSettings.avatarUrl || "/assets/sachin-one.png",
          });
        }
      } catch (err) {
        console.error("[useBlackholeHeroLogic] Failed to fetch hero content:", err);
      }
    }

    loadHeroContent();

    return () => {
      isMounted = false;
    };
  }, [getPageUseCase, siteSettings.avatarUrl]);

  // 2. Reduced Motion & Three.js Canvas Controller Lifecycle
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || mediaQuery.matches) {
      return () => {
        mediaQuery.removeEventListener("change", handleMotionChange);
      };
    }

    const isMobile = window.innerWidth < 768;
    const controller = new BlackholeSceneController();
    controller.init(canvas, { isMobile });

    // Performance Guard: IntersectionObserver pauses render loop when offscreen
    let isCurrentlyVisible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          isCurrentlyVisible = true;
          controller.start();
        } else {
          isCurrentlyVisible = false;
          controller.stop();
        }
      },
      { threshold: 0.05 }
    );

    if (container) {
      observer.observe(container);
    }

    // Resize handling
    const handleResize = () => {
      if (canvas && container) {
        controller.resize(container.clientWidth, container.clientHeight);
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Subtle pointer parallax
    const handlePointerMove = (e: MouseEvent) => {
      if (!isCurrentlyVisible) return;
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      controller.setPointer(normX, normY);
    };
    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      controller.dispose();
    };
  }, []);

  const content = useMemo<HeroContentData>(() => {
    return {
      eyebrow: sectionData?.eyebrow ?? HERO_FALLBACK_CONTENT.eyebrow,
      headline: sectionData?.headline ?? HERO_FALLBACK_CONTENT.headline,
      subheadline: sectionData?.subheadline ?? HERO_FALLBACK_CONTENT.subheadline,
      ctaPrimary: sectionData?.ctaPrimary ?? HERO_FALLBACK_CONTENT.ctaPrimary,
      ctaSecondary: sectionData?.ctaSecondary ?? HERO_FALLBACK_CONTENT.ctaSecondary,
      heroPhotoUrl: sectionData?.heroPhotoUrl ?? siteSettings.avatarUrl ?? "/assets/sachin-one.png",
      resumePdfUrl: siteSettings.resumePdfUrl ?? "/Sachin_Shakya_Resume.pdf",
    };
  }, [sectionData, siteSettings.avatarUrl, siteSettings.resumePdfUrl]);

  return {
    content,
    isReducedMotion,
    canvasRef,
    containerRef,
  };
}

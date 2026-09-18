// presentation/shared/seo/SeoHead.hooks.ts
// Hook synchronizing document head and Schema.org JSON-LD with component lifecycle.
// Universal Separation of Concerns (Rule 13) — zero JSX markup or CSS.

import { useEffect, useMemo } from "react";
import { JsonLdGenerator } from "../../../infrastructure/seo/JsonLdGenerator";
import { SeoMetadataManager } from "../../../infrastructure/seo/SeoMetadataManager";
import { env } from "../../../infrastructure/system/env";
import { SEO_CONSTANTS } from "./constants/seo.constants";
import type { SeoHeadProps } from "./SeoHead.types";

export function useSeoHead(props: SeoHeadProps): void {
  const { title, description, canonicalPath, ogImage, noIndex, jsonLd, breadcrumbs } = props;

  const resolvedBaseUrl = useMemo(() => {
    return (env.app.siteUrl || SEO_CONSTANTS.DEFAULT_CANONICAL).replace(/\/+$/, "");
  }, []);

  const resolvedTitle = useMemo(() => {
    if (!title) return SEO_CONSTANTS.DEFAULT_TITLE;
    if (title.includes("Sachin Shakya")) return title;
    return `${title} — Sachin Shakya`;
  }, [title]);

  const resolvedDescription = useMemo(() => {
    return description || SEO_CONSTANTS.DEFAULT_DESCRIPTION;
  }, [description]);

  const resolvedCanonicalUrl = useMemo(() => {
    if (canonicalPath === undefined) return resolvedBaseUrl;
    const clean = canonicalPath.replace(/^\/+|\/+$/g, "");
    return clean ? `${resolvedBaseUrl}/${clean}` : resolvedBaseUrl;
  }, [canonicalPath, resolvedBaseUrl]);

  const resolvedOgImage = useMemo(() => {
    if (!ogImage) return `${resolvedBaseUrl}${SEO_CONSTANTS.DEFAULT_OG_IMAGE}`;
    if (ogImage.startsWith("http://") || ogImage.startsWith("https://")) {
      return ogImage;
    }
    const clean = ogImage.replace(/^\/+/, "");
    return `${resolvedBaseUrl}/${clean}`;
  }, [ogImage, resolvedBaseUrl]);

  const resolvedJsonLd = useMemo(() => {
    if (jsonLd) return jsonLd;
    if (breadcrumbs && breadcrumbs.length > 0) {
      return JsonLdGenerator.generateBreadcrumbList(breadcrumbs, resolvedBaseUrl);
    }
    return JsonLdGenerator.generatePersonGraph({
      siteUrl: resolvedBaseUrl,
      socialLinks: SEO_CONSTANTS.SOCIAL_LINKS,
    });
  }, [jsonLd, breadcrumbs, resolvedBaseUrl]);

  useEffect(() => {
    SeoMetadataManager.applyPageSeo({
      title: resolvedTitle,
      description: resolvedDescription,
      canonicalUrl: resolvedCanonicalUrl,
      noIndex: Boolean(noIndex),
      openGraph: {
        title: resolvedTitle,
        description: resolvedDescription,
        image: resolvedOgImage,
        url: resolvedCanonicalUrl,
        type: "website",
      },
      twitter: {
        title: resolvedTitle,
        description: resolvedDescription,
        image: resolvedOgImage,
        cardType: "summary_large_image",
      },
      jsonLd: resolvedJsonLd,
      jsonLdId: SEO_CONSTANTS.JSON_LD_SCRIPT_ID,
    });

    return () => {
      // Cleanup custom JSON-LD if needed when navigating away
      if (jsonLd || (breadcrumbs && breadcrumbs.length > 0)) {
        SeoMetadataManager.removeJsonLd(SEO_CONSTANTS.JSON_LD_SCRIPT_ID);
      }
    };
  }, [
    resolvedTitle,
    resolvedDescription,
    resolvedCanonicalUrl,
    resolvedOgImage,
    resolvedJsonLd,
    noIndex,
    jsonLd,
    breadcrumbs,
  ]);
}

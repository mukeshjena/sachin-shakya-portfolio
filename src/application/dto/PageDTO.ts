// application/dto/PageDTO.ts
// Data Transfer Object for Page — the shape that use-cases return to the presentation layer.
// DTOs are plain serializable objects; they convert domain entities (which may contain
// value objects like Slug) into primitives safe for React state and JSON serialization.

import type { Page } from "../../domain/entities/content/Page";

/** Presentation-safe representation of a Page */
export interface PageDTO {
  id: string;
  /** Slug as a plain string (not a Slug value object) */
  slug: string;
  title: string;
  sectionOrder: string[];
  isPublished: boolean;
  showInHeader: boolean;
  showInFooter: boolean;
  subtitle?: string;
  richContent?: string;
  content?: string;
  category?: string;
  order?: number;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
  createdAt: string; // ISO 8601 string (Date objects aren't serializable)
  updatedAt: string;
}

/** Converts a domain Page entity to a presentation-safe PageDTO */
export function toPageDTO(page: Page): PageDTO {
  return {
    id: page.id,
    slug: page.slug.toString(),
    title: page.title,
    sectionOrder: page.sectionOrder,
    isPublished: page.isPublished,
    showInHeader: page.showInHeader,
    showInFooter: page.showInFooter,
    subtitle: page.subtitle ?? "",
    richContent: page.richContent ?? page.content ?? "",
    content: page.content ?? page.richContent ?? "",
    category: page.category ?? "",
    order: page.order ?? 0,
    seoTitle: page.seoTitle ?? page.title,
    seoDescription: page.seoDescription ?? "",
    seoImage: page.seoImage ?? "",
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };
}

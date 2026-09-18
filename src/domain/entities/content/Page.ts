// domain/entities/content/Page.ts
// Pure domain entity — zero framework imports allowed in this file.
// Any change here must also update scripts/seed/seed-content.ts (agent rule #9).

import type { Slug } from "../../value-objects/Slug";

/**
 * Represents a publishable page on the site.
 * Pages can be built-in (e.g. "home") or admin-created.
 */
export interface Page {
  /** Firestore document ID */
  id: string;
  /** URL-safe slug, unique across all pages */
  slug: Slug;
  /** Display title used in nav and SEO */
  title: string;
  /** Ordered list of Section IDs rendered on this page */
  sectionOrder: string[];
  /** Whether the page appears on the live site */
  isPublished: boolean;
  /** Whether to show a nav link in the site header */
  showInHeader: boolean;
  /** Whether to show a nav link in the footer */
  showInFooter: boolean;
  /** Subtitle or executive summary */
  subtitle?: string;
  /** Direct rich content (Markdown / HTML / CSS) */
  richContent?: string;
  content?: string;
  /** Categorization tag (e.g. cloud, architecture, legal) */
  category?: string;
  /** Navigation display order */
  order?: number;
  /** SEO overrides — falls back to siteSettings if absent */
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Used when creating a new page (ID + timestamps are assigned by the repository) */
export type CreatePageInput = Omit<Page, "id" | "slug" | "createdAt" | "updatedAt"> & {
  slug: string; // raw string, repository converts to Slug value object
};

/** Partial update payload — slug and id are immutable after creation */
export type UpdatePageInput = Partial<Omit<Page, "id" | "slug" | "createdAt" | "updatedAt">>;

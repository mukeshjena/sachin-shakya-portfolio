// domain/repositories/content/IPageRepository.ts
// Interface only — zero framework or infrastructure imports.

import type { CreatePageInput, Page, UpdatePageInput } from "../../entities/content/Page";
import type { Slug } from "../../value-objects/Slug";

/**
 * Contract for all page persistence operations.
 * Implemented by FirestorePageRepository in the infrastructure layer.
 */
export interface IPageRepository {
  /** Returns all pages (published and draft) — admin use only */
  getAll(): Promise<Page[]>;

  /** Returns only published pages — used for public site rendering */
  getPublished(): Promise<Page[]>;

  /** Returns pages flagged for header nav (published + showInHeader) */
  getHeaderNavPages(): Promise<Page[]>;

  /** Returns pages flagged for footer nav (published + showInFooter) */
  getFooterNavPages(): Promise<Page[]>;

  /** Fetches a single page by its slug — null if not found */
  getBySlug(slug: Slug): Promise<Page | null>;

  /** Creates a new page and returns it with server-assigned ID + timestamps */
  create(input: CreatePageInput): Promise<Page>;

  /** Applies partial updates to an existing page */
  update(id: string, updates: UpdatePageInput): Promise<Page>;

  /** Hard-deletes a page document (sections remain; caller must clean up) */
  delete(id: string): Promise<void>;
}

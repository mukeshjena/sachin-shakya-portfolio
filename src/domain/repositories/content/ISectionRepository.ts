// domain/repositories/content/ISectionRepository.ts
// Interface only — zero framework or infrastructure imports.

import type {
  CreateSectionInput,
  Section,
  UpdateSectionInput,
} from "../../entities/content/Section";

/**
 * Contract for all section persistence operations.
 * Implemented by FirestoreSectionRepository in the infrastructure layer.
 */
export interface ISectionRepository {
  /** Returns all sections for a given page, ordered by Section.order */
  getByPage(pageId: string): Promise<Section[]>;

  /** Returns visible sections for a given page (public site use) */
  getVisibleByPage(pageId: string): Promise<Section[]>;

  /** Fetches a single section by ID — null if not found */
  getById(id: string): Promise<Section | null>;

  /** Creates a new section and returns it with server-assigned ID + timestamps */
  create(input: CreateSectionInput): Promise<Section>;

  /** Applies partial updates to an existing section */
  update(id: string, updates: UpdateSectionInput): Promise<Section>;

  /** Hard-deletes a section document */
  delete(id: string): Promise<void>;

  /**
   * Atomically reorders sections on a page.
   * orderedIds must contain every section ID for the page; any missing ID
   * retains its previous order (implementation may throw on mismatch).
   */
  reorder(pageId: string, orderedIds: string[]): Promise<void>;
}

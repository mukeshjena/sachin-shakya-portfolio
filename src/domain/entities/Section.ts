// domain/entities/Section.ts
// Pure domain entity — zero framework imports allowed in this file.

/**
 * Built-in section types seeded from the résumé / index.html reference.
 * Admin-created sections use "custom" and provide their own schema via `content`.
 */
export type SectionType =
  | "hero"
  | "impact"
  | "experience"
  | "capabilities"
  | "credentials"
  | "contact"
  | "promo-popup"
  | "custom";

/**
 * A content block that belongs to a Page.
 * Sections are ordered via Page.sectionOrder[]; the `order` field here is the
 * canonical numeric position used by the seed script and for display fallback.
 */
export interface Section {
  /** Firestore document ID */
  id: string;
  /** ID of the Page this section belongs to */
  pageId: string;
  /** Determines which React component renders this section */
  type: SectionType;
  /** Admin-facing label (not necessarily shown on the public site) */
  title: string;
  /**
   * Type-erased content bag — each SectionType's component knows its own schema.
   * Kept as unknown here to preserve domain-layer purity (no UI-layer knowledge).
   */
  content: Record<string, unknown>;
  /** Numeric ordering position (mirrors Page.sectionOrder index) */
  order: number;
  /** Whether the section renders on the public site */
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateSectionInput = Omit<Section, "id" | "createdAt" | "updatedAt">;
export type UpdateSectionInput = Partial<
  Omit<Section, "id" | "pageId" | "type" | "createdAt" | "updatedAt">
>;

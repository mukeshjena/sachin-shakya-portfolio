// application/dto/SectionDTO.ts
// Data Transfer Object for Section — serializable shape returned to the presentation layer.

import type { Section, SectionType } from "../../domain/entities/content/Section";

/** Presentation-safe representation of a Section */
export interface SectionDTO {
  id: string;
  pageId: string;
  type: SectionType;
  title: string;
  /** Content bag — type-erased; each section component knows its own schema */
  content: Record<string, unknown>;
  order: number;
  isVisible: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

/** Converts a domain Section entity to a presentation-safe SectionDTO */
export function toSectionDTO(section: Section): SectionDTO {
  return {
    id: section.id,
    pageId: section.pageId,
    type: section.type,
    title: section.title,
    content: section.content,
    order: section.order,
    isVisible: section.isVisible,
    createdAt: section.createdAt.toISOString(),
    updatedAt: section.updatedAt.toISOString(),
  };
}

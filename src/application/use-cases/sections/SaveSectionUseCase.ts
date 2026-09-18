// application/use-cases/sections/SaveSectionUseCase.ts
// Use-case for creating or updating content sections on a page.
// Clean Architecture: zero UI framework dependencies.

import type { Section, SectionType } from "../../../domain/entities/content/Section";
import type { IPageRepository } from "../../../domain/repositories/content/IPageRepository";
import type { ISectionRepository } from "../../../domain/repositories/content/ISectionRepository";
import { Slug } from "../../../domain/value-objects/Slug";

export interface SaveSectionInput {
  readonly id?: string;
  readonly pageId: string;
  readonly type: SectionType;
  readonly title: string;
  readonly content: Record<string, unknown>;
  readonly isVisible: boolean;
  readonly order?: number;
}

export interface ISaveSectionUseCase {
  execute(input: SaveSectionInput): Promise<Section>;
}

export class SaveSectionUseCase implements ISaveSectionUseCase {
  private readonly sectionRepository: ISectionRepository;
  private readonly pageRepository: IPageRepository;

  constructor(sectionRepository: ISectionRepository, pageRepository: IPageRepository) {
    this.sectionRepository = sectionRepository;
    this.pageRepository = pageRepository;
  }

  async execute(input: SaveSectionInput): Promise<Section> {
    const trimmedTitle = input.title.trim();
    if (!trimmedTitle) {
      throw new Error("Section title is required.");
    }

    if (!input.pageId) {
      throw new Error("Section must belong to a valid page.");
    }

    // Updating an existing section
    if (input.id) {
      return this.sectionRepository.update(input.id, {
        title: trimmedTitle,
        content: input.content,
        isVisible: input.isVisible,
        order: input.order,
      });
    }

    // Creating a new section
    const existingSections = await this.sectionRepository.getByPage(input.pageId);
    const nextOrder = typeof input.order === "number" ? input.order : existingSections.length;

    const created = await this.sectionRepository.create({
      pageId: input.pageId,
      type: input.type,
      title: trimmedTitle,
      content: input.content,
      order: nextOrder,
      isVisible: input.isVisible,
    });

    // Update parent page sectionOrder list
    try {
      const slugObj = new Slug(input.pageId);
      const parentPage = await this.pageRepository.getBySlug(slugObj);
      if (parentPage) {
        await this.pageRepository.update(parentPage.id, {
          sectionOrder: [...parentPage.sectionOrder, created.id],
        });
      }
    } catch {
      // Fallback if pageId is not a valid slug
    }

    return created;
  }
}

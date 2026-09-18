// application/use-cases/pages/mutation/ReorderSectionsUseCase.ts
// Use-case for atomically updating the display order of sections on a page.
// Synchronizes both the Section order attributes and the parent Page.sectionOrder array.

import type { IPageRepository } from "../../../../domain/repositories/content/IPageRepository";
import type { ISectionRepository } from "../../../../domain/repositories/content/ISectionRepository";

export interface IReorderSectionsUseCase {
  execute(pageId: string, orderedSectionIds: string[]): Promise<void>;
}

export class ReorderSectionsUseCase implements IReorderSectionsUseCase {
  private readonly pageRepository: IPageRepository;
  private readonly sectionRepository: ISectionRepository;

  constructor(pageRepository: IPageRepository, sectionRepository: ISectionRepository) {
    this.pageRepository = pageRepository;
    this.sectionRepository = sectionRepository;
  }

  /**
   * Reorders sections for a page and updates the page's sectionOrder list.
   */
  async execute(pageId: string, orderedSectionIds: string[]): Promise<void> {
    if (!pageId || !orderedSectionIds.length) {
      return;
    }

    // 1. Reorder individual section documents
    await this.sectionRepository.reorder(pageId, orderedSectionIds);

    // 2. Update page document sectionOrder array
    await this.pageRepository.update(pageId, {
      sectionOrder: orderedSectionIds,
    });
  }
}

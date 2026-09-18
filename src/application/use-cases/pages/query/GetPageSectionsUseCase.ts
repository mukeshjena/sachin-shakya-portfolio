// application/use-cases/pages/query/GetPageSectionsUseCase.ts
// Use-case for resolving and ordering visible sections for a specific page.
// Adheres strictly to Clean Architecture — pure orchestration, zero framework dependencies.

import type { ISectionRepository } from "../../../../domain/repositories/content/ISectionRepository";
import { type SectionDTO, toSectionDTO } from "../../../dto/SectionDTO";

export interface IGetPageSectionsUseCase {
  execute(pageId: string, sectionOrder?: string[]): Promise<SectionDTO[]>;
}

export class GetPageSectionsUseCase implements IGetPageSectionsUseCase {
  private readonly sectionRepository: ISectionRepository;

  constructor(sectionRepository: ISectionRepository) {
    this.sectionRepository = sectionRepository;
  }

  /**
   * Resolves visible sections for a page, ordering them according to page.sectionOrder
   * with fallback to section.order.
   */
  async execute(pageId: string, sectionOrder?: string[]): Promise<SectionDTO[]> {
    if (!pageId) {
      return [];
    }

    const sections = await this.sectionRepository.getVisibleByPage(pageId);
    if (!sections.length) {
      return [];
    }

    // Order by sectionOrder if provided
    if (sectionOrder && sectionOrder.length > 0) {
      const orderMap = new Map<string, number>();
      for (let i = 0; i < sectionOrder.length; i++) {
        orderMap.set(sectionOrder[i], i);
      }

      sections.sort((a, b) => {
        const orderA = orderMap.has(a.id) ? (orderMap.get(a.id) as number) : a.order + 1000;
        const orderB = orderMap.has(b.id) ? (orderMap.get(b.id) as number) : b.order + 1000;
        return orderA - orderB;
      });
    } else {
      sections.sort((a, b) => a.order - b.order);
    }

    return sections.map(toSectionDTO);
  }
}

// application/use-cases/pages/GetPublishedPageBySlugUseCase.ts
// Use-case for retrieving a published page by its URL slug.
// Pure application orchestration: domain entities -> PageDTO. Zero framework dependencies.

import type { IPageRepository } from "../../../domain/repositories/content/IPageRepository";
import { Slug } from "../../../domain/value-objects/Slug";
import { type PageDTO, toPageDTO } from "../../dto/PageDTO";

export class GetPublishedPageBySlugUseCase {
  private readonly pageRepository: IPageRepository;

  constructor(pageRepository: IPageRepository) {
    this.pageRepository = pageRepository;
  }

  /**
   * Resolves a published page by its URL slug.
   *
   * @param rawSlug - The slug from URL parameters (e.g., "home", "about")
   * @returns PageDTO if found and published, or null if missing/draft/invalid slug.
   */
  async execute(rawSlug: string): Promise<PageDTO | null> {
    const slug = Slug.tryCreate(rawSlug);
    if (!slug) {
      return null;
    }

    const page = await this.pageRepository.getBySlug(slug);
    if (!page?.isPublished) {
      return null;
    }

    return toPageDTO(page);
  }
}

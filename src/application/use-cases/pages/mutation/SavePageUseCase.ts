// application/use-cases/pages/mutation/SavePageUseCase.ts
// Use-case for creating or updating a dynamic page with slug normalization and validation.
// Clean Architecture: zero UI framework dependencies.

import type { Page } from "../../../../domain/entities/content/Page";
import type { IPageRepository } from "../../../../domain/repositories/content/IPageRepository";
import { Slug } from "../../../../domain/value-objects/Slug";

export interface SavePageInput {
  readonly id?: string;
  readonly slug: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly richContent?: string;
  readonly category?: string;
  readonly order?: number;
  readonly isPublished: boolean;
  readonly showInHeader: boolean;
  readonly showInFooter: boolean;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly seoImage?: string;
}

export interface ISavePageUseCase {
  execute(input: SavePageInput): Promise<Page>;
}

export class SavePageUseCase implements ISavePageUseCase {
  private readonly pageRepository: IPageRepository;

  constructor(pageRepository: IPageRepository) {
    this.pageRepository = pageRepository;
  }

  async execute(input: SavePageInput): Promise<Page> {
    const trimmedTitle = input.title.trim();
    if (!trimmedTitle) {
      throw new Error("Page title is required.");
    }

    const slugStr = input.slug
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, "");
    if (!slugStr) {
      throw new Error("A valid URL slug is required.");
    }

    const slugObj = new Slug(slugStr);

    // If updating an existing page
    if (input.id) {
      const existing = await this.pageRepository.getBySlug(slugObj);
      if (existing && existing.id !== input.id) {
        throw new Error(`The slug '/${slugStr}' is already assigned to another page.`);
      }

      return this.pageRepository.update(input.id, {
        title: trimmedTitle,
        subtitle: input.subtitle?.trim() || undefined,
        richContent: input.richContent,
        category: input.category?.trim() || undefined,
        order: input.order,
        isPublished: input.isPublished,
        showInHeader: input.showInHeader,
        showInFooter: input.showInFooter,
        seoTitle: input.seoTitle?.trim() || undefined,
        seoDescription: input.seoDescription?.trim() || undefined,
        seoImage: input.seoImage?.trim() || undefined,
      });
    }

    // Creating a brand-new page
    const existing = await this.pageRepository.getBySlug(slugObj);
    if (existing) {
      throw new Error(`A page with slug '/${slugStr}' already exists.`);
    }

    return this.pageRepository.create({
      slug: slugStr,
      title: trimmedTitle,
      subtitle: input.subtitle?.trim() || undefined,
      richContent: input.richContent,
      category: input.category?.trim() || undefined,
      order: input.order,
      sectionOrder: [],
      isPublished: input.isPublished,
      showInHeader: input.showInHeader,
      showInFooter: input.showInFooter,
      seoTitle: input.seoTitle?.trim() || undefined,
      seoDescription: input.seoDescription?.trim() || undefined,
      seoImage: input.seoImage?.trim() || undefined,
    });
  }
}

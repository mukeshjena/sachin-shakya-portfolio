// application/use-cases/pages/GetFooterNavPagesUseCase.ts
// Use-case for fetching published pages configured for footer navigation.

import type { Page } from "../../../domain/entities/content/Page";
import type { IPageRepository } from "../../../domain/repositories/content/IPageRepository";

export interface IGetFooterNavPagesUseCase {
  execute(): Promise<Page[]>;
}

export class GetFooterNavPagesUseCase implements IGetFooterNavPagesUseCase {
  private readonly pageRepository: IPageRepository;

  constructor(pageRepository: IPageRepository) {
    this.pageRepository = pageRepository;
  }

  async execute(): Promise<Page[]> {
    return this.pageRepository.getFooterNavPages();
  }
}

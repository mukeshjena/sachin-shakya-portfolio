// application/use-cases/pages/GetHeaderNavPagesUseCase.ts
// Use-case for fetching published pages configured for header navigation.

import type { Page } from "../../../domain/entities/content/Page";
import type { IPageRepository } from "../../../domain/repositories/content/IPageRepository";

export interface IGetHeaderNavPagesUseCase {
  execute(): Promise<Page[]>;
}

export class GetHeaderNavPagesUseCase implements IGetHeaderNavPagesUseCase {
  private readonly pageRepository: IPageRepository;

  constructor(pageRepository: IPageRepository) {
    this.pageRepository = pageRepository;
  }

  async execute(): Promise<Page[]> {
    return this.pageRepository.getHeaderNavPages();
  }
}

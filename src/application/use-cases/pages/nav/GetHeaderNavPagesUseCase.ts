// application/use-cases/pages/nav/GetHeaderNavPagesUseCase.ts
// Use-case for resolving published pages that should be displayed in the site header.

import type { IPageRepository } from "../../../../domain/repositories/content/IPageRepository";
import { type PageDTO, toPageDTO } from "../../../dto/PageDTO";

export interface IGetHeaderNavPagesUseCase {
  execute(): Promise<PageDTO[]>;
}

export class GetHeaderNavPagesUseCase implements IGetHeaderNavPagesUseCase {
  private readonly pageRepository: IPageRepository;

  constructor(pageRepository: IPageRepository) {
    this.pageRepository = pageRepository;
  }

  async execute(): Promise<PageDTO[]> {
    const pages = await this.pageRepository.getHeaderNavPages();
    return pages.map(toPageDTO);
  }
}

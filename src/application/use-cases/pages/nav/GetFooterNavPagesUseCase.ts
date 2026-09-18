// application/use-cases/pages/nav/GetFooterNavPagesUseCase.ts
// Use-case for resolving published pages that should be displayed in the site footer.

import type { IPageRepository } from "../../../../domain/repositories/content/IPageRepository";
import { type PageDTO, toPageDTO } from "../../../dto/PageDTO";

export interface IGetFooterNavPagesUseCase {
  execute(): Promise<PageDTO[]>;
}

export class GetFooterNavPagesUseCase implements IGetFooterNavPagesUseCase {
  private readonly pageRepository: IPageRepository;

  constructor(pageRepository: IPageRepository) {
    this.pageRepository = pageRepository;
  }

  async execute(): Promise<PageDTO[]> {
    const pages = await this.pageRepository.getFooterNavPages();
    return pages.map(toPageDTO);
  }
}

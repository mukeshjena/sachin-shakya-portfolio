// application/use-cases/pages/mutation/DeletePageUseCase.ts
// Use-case for deleting a dynamic page while strictly protecting the root home page.
// Clean Architecture: zero UI framework dependencies.

import type { IPageRepository } from "../../../../domain/repositories/content/IPageRepository";

export interface DeletePageInput {
  readonly id: string;
  readonly slug?: string;
}

export interface IDeletePageUseCase {
  execute(input: DeletePageInput): Promise<void>;
}

export class DeletePageUseCase implements IDeletePageUseCase {
  private readonly pageRepository: IPageRepository;

  constructor(pageRepository: IPageRepository) {
    this.pageRepository = pageRepository;
  }

  async execute(input: DeletePageInput): Promise<void> {
    if (!input.id) {
      throw new Error("Page ID is required for deletion.");
    }

    if (input.slug === "home" || input.id === "home") {
      throw new Error("Security Violation: The primary root 'home' page cannot be deleted.");
    }

    await this.pageRepository.delete(input.id);
  }
}

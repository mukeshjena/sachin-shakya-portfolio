// application/use-cases/contact/DeleteContactSubmissionUseCase.ts
// Use-case for deleting a contact inquiry document from the admin inbox.
// Clean Architecture: zero UI framework dependencies.

import type { IContactRepository } from "../../../domain/repositories/admin/IContactRepository";

export interface DeleteContactSubmissionInput {
  readonly id: string;
}

export interface IDeleteContactSubmissionUseCase {
  execute(input: DeleteContactSubmissionInput | string): Promise<void>;
}

export class DeleteContactSubmissionUseCase implements IDeleteContactSubmissionUseCase {
  private readonly contactRepository: IContactRepository;

  constructor(contactRepository: IContactRepository) {
    this.contactRepository = contactRepository;
  }

  async execute(input: DeleteContactSubmissionInput | string): Promise<void> {
    const targetId = typeof input === "string" ? input : input?.id;
    if (!targetId) {
      throw new Error("A valid submission ID must be provided for deletion.");
    }
    await this.contactRepository.delete(targetId);
  }
}

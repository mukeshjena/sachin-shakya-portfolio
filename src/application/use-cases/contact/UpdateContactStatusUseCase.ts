// application/use-cases/contact/UpdateContactStatusUseCase.ts
// Use-case for toggling read/unread state of a contact submission in the admin inbox.
// Clean Architecture: zero UI framework dependencies.

import type { IContactRepository } from "../../../domain/repositories/admin/IContactRepository";

export interface UpdateContactStatusInput {
  readonly id: string;
  readonly isRead: boolean;
}

export interface IUpdateContactStatusUseCase {
  execute(input: UpdateContactStatusInput): Promise<void>;
}

export class UpdateContactStatusUseCase implements IUpdateContactStatusUseCase {
  private readonly contactRepository: IContactRepository;

  constructor(contactRepository: IContactRepository) {
    this.contactRepository = contactRepository;
  }

  async execute(input: UpdateContactStatusInput): Promise<void> {
    if (!input.id) {
      throw new Error("A valid submission ID must be provided.");
    }

    if (input.isRead) {
      await this.contactRepository.markRead(input.id);
    } else {
      await this.contactRepository.markUnread(input.id);
    }
  }
}

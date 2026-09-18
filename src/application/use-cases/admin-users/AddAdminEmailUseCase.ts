// application/use-cases/admin-users/AddAdminEmailUseCase.ts
// Whitelists a new team member or co-architect for administrative access.
// Zero UI framework dependencies (Clean Architecture application layer).

import type { IAdminAccessRepository } from "../../../domain/repositories/admin/IAdminAccessRepository";

export interface AddAdminEmailInput {
  readonly email: string;
}

export interface AddAdminEmailResult {
  readonly success: boolean;
  readonly email: string;
}

export interface IAddAdminEmailUseCase {
  execute(input: AddAdminEmailInput): Promise<AddAdminEmailResult>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AddAdminEmailUseCase implements IAddAdminEmailUseCase {
  private readonly adminAccessRepo: IAdminAccessRepository;

  constructor(adminAccessRepo: IAdminAccessRepository) {
    this.adminAccessRepo = adminAccessRepo;
  }

  async execute(input: AddAdminEmailInput): Promise<AddAdminEmailResult> {
    const trimmed = input.email ? input.email.trim().toLowerCase() : "";

    if (!EMAIL_REGEX.test(trimmed)) {
      throw new Error("Please provide a valid corporate or personal email address.");
    }

    const alreadyAuthorized = await this.adminAccessRepo.isAuthorizedEmail(trimmed);
    if (alreadyAuthorized) {
      throw new Error(`The email '${trimmed}' is already an authorized platform administrator.`);
    }

    await this.adminAccessRepo.addAuthorizedEmail(trimmed);

    return {
      success: true,
      email: trimmed,
    };
  }
}

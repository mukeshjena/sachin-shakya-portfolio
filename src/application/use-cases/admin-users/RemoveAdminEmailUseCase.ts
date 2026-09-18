// application/use-cases/admin-users/RemoveAdminEmailUseCase.ts
// Revokes administrative authorization for a team member while protecting root admin.
// Zero UI framework dependencies (Clean Architecture application layer).

import type { IAdminAccessRepository } from "../../../domain/repositories/admin/IAdminAccessRepository";

export interface RemoveAdminEmailInput {
  readonly email: string;
}

export interface RemoveAdminEmailResult {
  readonly success: boolean;
  readonly email: string;
}

export interface IRemoveAdminEmailUseCase {
  execute(input: RemoveAdminEmailInput): Promise<RemoveAdminEmailResult>;
}

const ROOT_ADMIN_EMAIL = "sachin.shakya@live.com";

export class RemoveAdminEmailUseCase implements IRemoveAdminEmailUseCase {
  private readonly adminAccessRepo: IAdminAccessRepository;

  constructor(adminAccessRepo: IAdminAccessRepository) {
    this.adminAccessRepo = adminAccessRepo;
  }

  async execute(input: RemoveAdminEmailInput): Promise<RemoveAdminEmailResult> {
    const trimmed = input.email ? input.email.trim().toLowerCase() : "";

    if (trimmed === ROOT_ADMIN_EMAIL) {
      throw new Error(
        "Security Violation: The primary root administrator (sachin.shakya@live.com) cannot be revoked."
      );
    }

    const isAuthorized = await this.adminAccessRepo.isAuthorizedEmail(trimmed);
    if (!isAuthorized) {
      throw new Error(`The email '${trimmed}' is not currently an authorized administrator.`);
    }

    await this.adminAccessRepo.removeAuthorizedEmail(trimmed);

    return {
      success: true,
      email: trimmed,
    };
  }
}

// application/use-cases/admin-users/GetAuthorizedEmailsUseCase.ts
// Query use-case returning all authorized admin email addresses.
// Zero UI framework dependencies (Clean Architecture application layer).

import type { IAdminAccessRepository } from "../../../domain/repositories/admin/IAdminAccessRepository";

export interface IGetAuthorizedEmailsUseCase {
  execute(): Promise<string[]>;
}

export class GetAuthorizedEmailsUseCase implements IGetAuthorizedEmailsUseCase {
  private readonly adminAccessRepo: IAdminAccessRepository;

  constructor(adminAccessRepo: IAdminAccessRepository) {
    this.adminAccessRepo = adminAccessRepo;
  }

  async execute(): Promise<string[]> {
    return this.adminAccessRepo.getAuthorizedEmails();
  }
}

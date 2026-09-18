// application/use-cases/settings/UpdateSiteSettingsUseCase.ts
// Use-case for updating global site settings, profile copy, and social links.
// Clean Architecture: zero UI framework dependencies.

import type { UpdateSiteSettingsInput } from "../../../domain/entities/admin/SiteSettings";
import type { ISiteSettingsRepository } from "../../../domain/repositories/settings/ISiteSettingsRepository";

export interface IUpdateSiteSettingsUseCase {
  execute(input: UpdateSiteSettingsInput): Promise<void>;
}

export class UpdateSiteSettingsUseCase implements IUpdateSiteSettingsUseCase {
  private readonly siteSettingsRepository: ISiteSettingsRepository;

  constructor(siteSettingsRepository: ISiteSettingsRepository) {
    this.siteSettingsRepository = siteSettingsRepository;
  }

  async execute(input: UpdateSiteSettingsInput): Promise<void> {
    if (input.email && !input.email.includes("@")) {
      throw new Error("A valid email address is required for site contact settings.");
    }

    await this.siteSettingsRepository.updateSettings(input);
  }
}

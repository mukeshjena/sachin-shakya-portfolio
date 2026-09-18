// application/use-cases/settings/GetSiteSettingsUseCase.ts
// Use-case for fetching the global site settings.

import type { SiteSettings } from "../../../domain/entities/admin/SiteSettings";
import type { ISiteSettingsRepository } from "../../../domain/repositories/settings/ISiteSettingsRepository";

export interface IGetSiteSettingsUseCase {
  execute(): Promise<SiteSettings | null>;
}

export class GetSiteSettingsUseCase implements IGetSiteSettingsUseCase {
  private readonly siteSettingsRepository: ISiteSettingsRepository;

  constructor(siteSettingsRepository: ISiteSettingsRepository) {
    this.siteSettingsRepository = siteSettingsRepository;
  }

  async execute(): Promise<SiteSettings | null> {
    return this.siteSettingsRepository.getSettings();
  }
}

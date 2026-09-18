// application/use-cases/settings/SubscribeSiteSettingsUseCase.ts
// Use-case for subscribing to real-time updates of global site settings.

import type { SiteSettings } from "../../../domain/entities/admin/SiteSettings";
import type { ISiteSettingsRepository } from "../../../domain/repositories/settings/ISiteSettingsRepository";

export interface ISubscribeSiteSettingsUseCase {
  execute(onUpdate: (settings: SiteSettings) => void, onError?: (error: Error) => void): () => void;
}

export class SubscribeSiteSettingsUseCase implements ISubscribeSiteSettingsUseCase {
  private readonly siteSettingsRepository: ISiteSettingsRepository;

  constructor(siteSettingsRepository: ISiteSettingsRepository) {
    this.siteSettingsRepository = siteSettingsRepository;
  }

  execute(
    onUpdate: (settings: SiteSettings) => void,
    onError?: (error: Error) => void
  ): () => void {
    return this.siteSettingsRepository.subscribeSettings(onUpdate, onError);
  }
}

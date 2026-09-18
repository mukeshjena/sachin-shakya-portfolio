// domain/repositories/settings/ISiteSettingsRepository.ts
// Pure domain repository interface for global site configuration.
// Adheres to Clean Architecture: zero external framework dependencies.

import type { SiteSettings, UpdateSiteSettingsInput } from "../../entities/admin/SiteSettings";

export interface ISiteSettingsRepository {
  /**
   * Fetches the singleton site settings document.
   * Returns null if uninitialized in the data store.
   */
  getSettings(): Promise<SiteSettings | null>;

  /**
   * Subscribes to real-time updates for site settings.
   * Leverages multi-tab offline cache and fires immediately on cached or server updates.
   *
   * @param onUpdate Callback invoked with fresh SiteSettings data.
   * @param onError Optional error handler callback.
   * @returns Unsubscribe function.
   */
  subscribeSettings(
    onUpdate: (settings: SiteSettings) => void,
    onError?: (error: Error) => void
  ): () => void;

  /**
   * Updates site settings with partial fields.
   */
  updateSettings(input: UpdateSiteSettingsInput): Promise<void>;
}

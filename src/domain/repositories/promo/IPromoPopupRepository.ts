// domain/repositories/promo/IPromoPopupRepository.ts
// Contract for promo popup configuration persistence.
// Pure TypeScript — zero framework or infrastructure imports.

import type { PromoPopup, UpdatePromoPopupInput } from "../../entities/admin/PromoPopup";

export interface IPromoPopupRepository {
  /**
   * Fetches the singleton promo popup configuration.
   * Returns null if no configuration document exists.
   */
  get(): Promise<PromoPopup | null>;

  /**
   * Updates the singleton promo popup configuration.
   * Returns the updated configuration.
   */
  update(input: UpdatePromoPopupInput): Promise<PromoPopup>;
}

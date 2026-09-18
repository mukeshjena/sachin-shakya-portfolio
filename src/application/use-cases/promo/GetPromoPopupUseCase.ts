// application/use-cases/promo/GetPromoPopupUseCase.ts
// Pure application orchestration: retrieves active promo popup configuration.
// Zero UI framework dependencies (Clean Architecture application layer).

import type { IPromoPopupRepository } from "../../../domain/repositories/promo/IPromoPopupRepository";
import { type PromoPopupDTO, toPromoPopupDTO } from "../../dto/promo/PromoPopupDTO";

export interface IGetPromoPopupUseCase {
  execute(includeDisabled?: boolean): Promise<PromoPopupDTO | null>;
}

export class GetPromoPopupUseCase implements IGetPromoPopupUseCase {
  private readonly promoRepository: IPromoPopupRepository;

  constructor(promoRepository: IPromoPopupRepository) {
    this.promoRepository = promoRepository;
  }

  /**
   * Resolves the singleton promo popup configuration.
   * Returns null if missing or explicitly disabled unless includeDisabled is true.
   */
  async execute(includeDisabled = false): Promise<PromoPopupDTO | null> {
    const promo = await this.promoRepository.get();
    if (!promo) {
      return null;
    }
    if (!includeDisabled && !promo.isEnabled) {
      return null;
    }
    return toPromoPopupDTO(promo);
  }
}

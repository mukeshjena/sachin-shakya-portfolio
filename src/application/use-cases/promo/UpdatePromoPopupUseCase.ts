// application/use-cases/promo/UpdatePromoPopupUseCase.ts
// Use case for updating the promo popup configuration in Firestore.
// Universal Clean Architecture application layer — zero UI dependencies.

import type { UpdatePromoPopupInput } from "../../../domain/entities/admin/PromoPopup";
import type { IPromoPopupRepository } from "../../../domain/repositories/promo/IPromoPopupRepository";
import { type PromoPopupDTO, toPromoPopupDTO } from "../../dto/promo/PromoPopupDTO";

export interface IUpdatePromoPopupUseCase {
  execute(input: UpdatePromoPopupInput): Promise<PromoPopupDTO>;
}

export class UpdatePromoPopupUseCase implements IUpdatePromoPopupUseCase {
  private readonly promoRepository: IPromoPopupRepository;

  constructor(promoRepository: IPromoPopupRepository) {
    this.promoRepository = promoRepository;
  }

  async execute(input: UpdatePromoPopupInput): Promise<PromoPopupDTO> {
    const updated = await this.promoRepository.update(input);
    return toPromoPopupDTO(updated);
  }
}

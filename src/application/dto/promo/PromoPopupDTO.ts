// application/dto/promo/PromoPopupDTO.ts
// Serialized presentation-safe DTO for dynamic promo popup configuration.

import type { PromoPopup } from "../../../domain/entities/admin/PromoPopup";

export interface PromoPopupDTO {
  readonly id: string;
  readonly isEnabled: boolean;
  readonly heading: string;
  readonly subheading: string;
  readonly badgeText?: string;
  readonly ctaText: string;
  readonly ctaLink?: string;
  readonly imageUrl?: string;
  readonly displayDelaySeconds: number;
  readonly recurrenceDays: number;
  readonly updatedAtIso: string;
}

export function toPromoPopupDTO(entity: PromoPopup): PromoPopupDTO {
  return {
    id: entity.id,
    isEnabled: entity.isEnabled,
    heading: entity.heading,
    subheading: entity.subheading,
    badgeText: entity.badgeText,
    ctaText: entity.ctaText,
    ctaLink: entity.ctaLink,
    imageUrl: entity.imageUrl,
    displayDelaySeconds: entity.displayDelaySeconds,
    recurrenceDays: entity.recurrenceDays,
    updatedAtIso: entity.updatedAt.toISOString(),
  };
}

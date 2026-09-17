// domain/entities/admin/PromoPopup.ts
// Pure domain entity modeling dynamic executive promo popups and consultative lead hooks.

export interface PromoPopup {
  /** Deterministic singleton document ID: "global" */
  readonly id: "global";
  readonly isEnabled: boolean;
  readonly heading: string;
  readonly subheading: string;
  readonly badgeText?: string;
  readonly ctaText: string;
  readonly ctaLink?: string;
  readonly imageUrl?: string;
  /** Seconds of page dwell time before displaying popup */
  readonly displayDelaySeconds: number;
  /** Days before popup reappears after user dismissal */
  readonly recurrenceDays: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type UpdatePromoPopupInput = Partial<Omit<PromoPopup, "id" | "createdAt" | "updatedAt">>;

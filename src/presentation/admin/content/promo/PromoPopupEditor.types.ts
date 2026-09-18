// presentation/admin/content/promo/PromoPopupEditor.types.ts
// TypeScript types and view-model interfaces for PromoPopupEditor.

export interface PromoPopupFormState {
  readonly isEnabled: boolean;
  readonly heading: string;
  readonly subheading: string;
  readonly badgeText: string;
  readonly ctaText: string;
  readonly displayDelaySeconds: number;
  readonly frequency: "session" | "always";
}

export interface PromoPopupEditorViewModel {
  readonly formData: PromoPopupFormState;
  readonly isLoading: boolean;
  readonly isSaving: boolean;
  readonly statusMessage: string | null;
  readonly handleChange: <K extends keyof PromoPopupFormState>(
    field: K,
    value: PromoPopupFormState[K]
  ) => void;
  readonly handleSave: (e: React.FormEvent) => Promise<void>;
}

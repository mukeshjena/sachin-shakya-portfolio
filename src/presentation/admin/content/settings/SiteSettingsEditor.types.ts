// presentation/admin/content/settings/SiteSettingsEditor.types.ts
// Type contracts for the site configuration and social link editor.

import type { SocialLink } from "../../../../domain/entities/admin/SiteSettings";

export interface SiteSettingsFormData {
  readonly fullName: string;
  readonly headline: string;
  readonly shortBio: string;
  readonly email: string;
  readonly phone: string;
  readonly location: string;
  readonly logoUrl: string;
  readonly socialLinks: readonly SocialLink[];
}

export interface SiteSettingsEditorViewModel {
  readonly formData: SiteSettingsFormData;
  readonly isSaving: boolean;
  readonly isSuccess: boolean;
  readonly errorMessage: string | null;
  readonly handleChange: (field: keyof SiteSettingsFormData, value: unknown) => void;
  readonly handleSocialLinkChange: (index: number, field: keyof SocialLink, value: unknown) => void;
  readonly handleAddSocialLink: () => void;
  readonly handleRemoveSocialLink: (index: number) => void;
  readonly handleSubmit: (e: React.FormEvent) => Promise<void>;
}

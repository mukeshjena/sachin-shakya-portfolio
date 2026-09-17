// domain/entities/admin/SiteSettings.ts
// Pure domain entity modeling global site configuration, profile metadata, and social links.

export interface SocialLink {
  readonly platform: "linkedin" | "github" | "email" | "twitter" | "custom";
  readonly label: string;
  readonly url: string;
  readonly isVisible: boolean;
  readonly order: number;
}

export interface SiteSettings {
  /** Deterministic singleton document ID: "global" */
  readonly id: "global";
  readonly fullName: string;
  readonly headline: string;
  readonly shortBio: string;
  readonly email: string;
  readonly phone: string;
  readonly location: string;
  readonly logoUrl: string;
  readonly avatarUrl?: string;
  readonly resumePdfUrl?: string;
  readonly socialLinks: readonly SocialLink[];
  readonly availabilityStatus: "available" | "consulting_only" | "unavailable";
  readonly availabilityNote?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type UpdateSiteSettingsInput = Partial<Omit<SiteSettings, "id" | "createdAt" | "updatedAt">>;

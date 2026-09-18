// infrastructure/di/tokens.ts
// Injection tokens — unique Symbols used to key registrations in the container.
// Import these in both container.ts (for registration) and useContainer.ts (for resolution).

/**
 * Central registry of all DI tokens.
 * Using Symbols prevents accidental name collisions across features.
 *
 * Convention: token name matches the interface it resolves to.
 */
export const DI_TOKENS = {
  // ── Content repositories ──────────────────────────────────────────────────
  PageRepository: Symbol("IPageRepository"),
  SectionRepository: Symbol("ISectionRepository"),
  MediaRepository: Symbol("IMediaRepository"),

  // ── Admin repositories / services ─────────────────────────────────────────
  AdminAccessRepository: Symbol("IAdminAccessRepository"),
  ContactRepository: Symbol("IContactRepository"),
  EmailSender: Symbol("IEmailSender"),
  MediaUploader: Symbol("IMediaUploader"),
  PromoPopupRepository: Symbol("IPromoPopupRepository"),
  SiteSettingsRepository: Symbol("ISiteSettingsRepository"),
  TelemetryRepository: Symbol("ITelemetryRepository"),

  // ── Application-layer use-cases ───────────────────────────────────────────
  // (populated as use-cases are implemented in Steps 11+)
  GetPublishedPages: Symbol("GetPublishedPages"),
  GetPublishedPageBySlug: Symbol("GetPublishedPageBySlug"),
  GetPageSections: Symbol("GetPageSections"),
  ReorderSections: Symbol("ReorderSections"),
  GetHeaderNavPages: Symbol("GetHeaderNavPages"),
  GetFooterNavPages: Symbol("GetFooterNavPages"),
  GetSiteSettings: Symbol("GetSiteSettings"),
  SubscribeSiteSettings: Symbol("SubscribeSiteSettings"),
  SubmitContactForm: Symbol("SubmitContactForm"),
  GetPromoPopup: Symbol("GetPromoPopup"),
  SubmitPromoInquiry: Symbol("SubmitPromoInquiry"),
  RequestAccessCode: Symbol("RequestAccessCode"),
  VerifyAccessCode: Symbol("VerifyAccessCode"),
  GetAuthorizedEmails: Symbol("GetAuthorizedEmails"),
  AddAdminEmail: Symbol("AddAdminEmail"),
  RemoveAdminEmail: Symbol("RemoveAdminEmail"),
  SavePage: Symbol("SavePage"),
  DeletePage: Symbol("DeletePage"),
  SaveSection: Symbol("SaveSection"),
  UpdateSiteSettings: Symbol("UpdateSiteSettings"),
  SaveTelemetryMetrics: Symbol("SaveTelemetryMetrics"),

  // ── System / Infrastructure ──────────────────────────────────────────────
  RealtimeSyncService: Symbol("IRealtimeSyncService"),
  FirestoreDb: Symbol("FirestoreDb"),
  EnvConfig: Symbol("EnvConfig"),

  // ── Dev / test ────────────────────────────────────────────────────────────
  PingUseCase: Symbol("PingUseCase"),
} as const;

export type DiToken = (typeof DI_TOKENS)[keyof typeof DI_TOKENS];

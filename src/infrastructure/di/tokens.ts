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

  // ── Application-layer use-cases ───────────────────────────────────────────
  // (populated as use-cases are implemented in Steps 11+)
  GetPublishedPages: Symbol("GetPublishedPages"),
  GetPublishedPageBySlug: Symbol("GetPublishedPageBySlug"),
  SubmitContactForm: Symbol("SubmitContactForm"),
  SubmitPromoInquiry: Symbol("SubmitPromoInquiry"),
  RequestAccessCode: Symbol("RequestAccessCode"),
  VerifyAccessCode: Symbol("VerifyAccessCode"),

  // ── System / Infrastructure ──────────────────────────────────────────────
  FirestoreDb: Symbol("FirestoreDb"),
  EnvConfig: Symbol("EnvConfig"),

  // ── Dev / test ────────────────────────────────────────────────────────────
  PingUseCase: Symbol("PingUseCase"),
} as const;

export type DiToken = (typeof DI_TOKENS)[keyof typeof DI_TOKENS];

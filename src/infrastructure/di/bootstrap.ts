// infrastructure/di/bootstrap.ts
// Registers all concrete implementations into the DI container.
// This is the ONLY file that imports both infrastructure classes and DI tokens together.
// Import this once at app startup (main.tsx), before any component renders.

import { GetFooterNavPagesUseCase } from "../../application/use-cases/pages/GetFooterNavPagesUseCase";
import { GetHeaderNavPagesUseCase } from "../../application/use-cases/pages/GetHeaderNavPagesUseCase";
import { GetPublishedPageBySlugUseCase } from "../../application/use-cases/pages/GetPublishedPageBySlugUseCase";
import { PingUseCase } from "../../application/use-cases/ping/PingUseCase";
import { GetSiteSettingsUseCase } from "../../application/use-cases/settings/GetSiteSettingsUseCase";
import { SubscribeSiteSettingsUseCase } from "../../application/use-cases/settings/SubscribeSiteSettingsUseCase";
import type { IPageRepository } from "../../domain/repositories/content/IPageRepository";
import type { ISiteSettingsRepository } from "../../domain/repositories/settings/ISiteSettingsRepository";
import { CloudinaryMediaUploader } from "../cloudinary/CloudinaryMediaUploader";
import { getDb } from "../firebase/firebaseClient";
import { FirestorePageRepository } from "../repositories/content/FirestorePageRepository";
import { FirestoreSiteSettingsRepository } from "../repositories/settings/FirestoreSiteSettingsRepository";
import { getEnv } from "../system/env";
import { container, singleton } from "./container";
import { DI_TOKENS } from "./tokens";

/**
 * Bootstraps the DI container with all concrete bindings.
 *
 * Ordering: infrastructure registrations first, then use-cases that depend on them.
 */
export function bootstrapContainer(): void {
  // ── System / Infrastructure ────────────────────────────────────────────────
  container.register(DI_TOKENS.FirestoreDb, () => getDb());
  container.register(DI_TOKENS.EnvConfig, () => getEnv());
  container.register(
    DI_TOKENS.MediaUploader,
    singleton(() => new CloudinaryMediaUploader())
  );

  // ── Dev / verification ──────────────────────────────────────────────────────
  container.register(
    DI_TOKENS.PingUseCase,
    singleton(() => new PingUseCase())
  );

  // ── Content & Settings repositories (Step 11 & 13) ─────────────────────────
  container.register(
    DI_TOKENS.PageRepository,
    singleton(() => new FirestorePageRepository())
  );
  container.register(
    DI_TOKENS.SiteSettingsRepository,
    singleton(() => new FirestoreSiteSettingsRepository())
  );

  // ── Use-cases (Step 11, 13 & 14) ───────────────────────────────────────────
  container.register(
    DI_TOKENS.GetPublishedPageBySlug,
    singleton(
      () =>
        new GetPublishedPageBySlugUseCase(
          container.resolve<IPageRepository>(DI_TOKENS.PageRepository)
        )
    )
  );
  container.register(
    DI_TOKENS.GetHeaderNavPages,
    singleton(
      () =>
        new GetHeaderNavPagesUseCase(container.resolve<IPageRepository>(DI_TOKENS.PageRepository))
    )
  );
  container.register(
    DI_TOKENS.GetFooterNavPages,
    singleton(
      () =>
        new GetFooterNavPagesUseCase(container.resolve<IPageRepository>(DI_TOKENS.PageRepository))
    )
  );
  container.register(
    DI_TOKENS.GetSiteSettings,
    singleton(
      () =>
        new GetSiteSettingsUseCase(
          container.resolve<ISiteSettingsRepository>(DI_TOKENS.SiteSettingsRepository)
        )
    )
  );
  container.register(
    DI_TOKENS.SubscribeSiteSettings,
    singleton(
      () =>
        new SubscribeSiteSettingsUseCase(
          container.resolve<ISiteSettingsRepository>(DI_TOKENS.SiteSettingsRepository)
        )
    )
  );
}

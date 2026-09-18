// infrastructure/di/bootstrap.ts
// Registers all concrete implementations into the DI container.
// This is the ONLY file that imports both infrastructure classes and DI tokens together.
// Import this once at app startup (main.tsx), before any component renders.

import { SubmitContactFormUseCase } from "../../application/use-cases/contact/SubmitContactFormUseCase";
import { ReorderSectionsUseCase } from "../../application/use-cases/pages/mutation/ReorderSectionsUseCase";
import { GetFooterNavPagesUseCase } from "../../application/use-cases/pages/nav/GetFooterNavPagesUseCase";
import { GetHeaderNavPagesUseCase } from "../../application/use-cases/pages/nav/GetHeaderNavPagesUseCase";
import { GetPageSectionsUseCase } from "../../application/use-cases/pages/query/GetPageSectionsUseCase";
import { GetPublishedPageBySlugUseCase } from "../../application/use-cases/pages/query/GetPublishedPageBySlugUseCase";
import { PingUseCase } from "../../application/use-cases/ping/PingUseCase";
import { GetPromoPopupUseCase } from "../../application/use-cases/promo/GetPromoPopupUseCase";
import { SubmitPromoInquiryUseCase } from "../../application/use-cases/promo/SubmitPromoInquiryUseCase";
import { GetSiteSettingsUseCase } from "../../application/use-cases/settings/GetSiteSettingsUseCase";
import { SubscribeSiteSettingsUseCase } from "../../application/use-cases/settings/SubscribeSiteSettingsUseCase";
import type { IContactRepository } from "../../domain/repositories/admin/IContactRepository";
import type { IEmailSender } from "../../domain/repositories/admin/IEmailSender";
import type { IPageRepository } from "../../domain/repositories/content/IPageRepository";
import type { ISectionRepository } from "../../domain/repositories/content/ISectionRepository";
import type { IPromoPopupRepository } from "../../domain/repositories/promo/IPromoPopupRepository";
import type { ISiteSettingsRepository } from "../../domain/repositories/settings/ISiteSettingsRepository";
import { CloudinaryMediaUploader } from "../cloudinary/CloudinaryMediaUploader";
import { EmailApiSender } from "../email/EmailApiSender";
import { getDb } from "../firebase/firebaseClient";
import { FirestoreContactRepository } from "../repositories/admin/FirestoreContactRepository";
import { FirestorePromoPopupRepository } from "../repositories/admin/FirestorePromoPopupRepository";
import { FirestorePageRepository } from "../repositories/content/FirestorePageRepository";
import { FirestoreSectionRepository } from "../repositories/content/FirestoreSectionRepository";
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

  // ── Content & Settings repositories (Step 11, 13, 17 & 18) ────────────────
  container.register(
    DI_TOKENS.PageRepository,
    singleton(() => new FirestorePageRepository())
  );
  container.register(
    DI_TOKENS.SectionRepository,
    singleton(() => new FirestoreSectionRepository())
  );
  container.register(
    DI_TOKENS.ContactRepository,
    singleton(() => new FirestoreContactRepository())
  );
  container.register(
    DI_TOKENS.EmailSender,
    singleton(() => new EmailApiSender())
  );
  container.register(
    DI_TOKENS.SiteSettingsRepository,
    singleton(() => new FirestoreSiteSettingsRepository())
  );
  container.register(
    DI_TOKENS.PromoPopupRepository,
    singleton(() => new FirestorePromoPopupRepository())
  );

  // ── Use-cases (Step 11, 13, 14 & 17) ───────────────────────────────────────
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
    DI_TOKENS.GetPageSections,
    singleton(
      () =>
        new GetPageSectionsUseCase(
          container.resolve<ISectionRepository>(DI_TOKENS.SectionRepository)
        )
    )
  );
  container.register(
    DI_TOKENS.ReorderSections,
    singleton(
      () =>
        new ReorderSectionsUseCase(
          container.resolve<IPageRepository>(DI_TOKENS.PageRepository),
          container.resolve<ISectionRepository>(DI_TOKENS.SectionRepository)
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
  container.register(
    DI_TOKENS.SubmitContactForm,
    singleton(
      () =>
        new SubmitContactFormUseCase(
          container.resolve<IContactRepository>(DI_TOKENS.ContactRepository),
          container.resolve<IEmailSender>(DI_TOKENS.EmailSender)
        )
    )
  );
  container.register(
    DI_TOKENS.GetPromoPopup,
    singleton(
      () =>
        new GetPromoPopupUseCase(
          container.resolve<IPromoPopupRepository>(DI_TOKENS.PromoPopupRepository)
        )
    )
  );
  container.register(
    DI_TOKENS.SubmitPromoInquiry,
    singleton(
      () =>
        new SubmitPromoInquiryUseCase(
          container.resolve<IContactRepository>(DI_TOKENS.ContactRepository),
          container.resolve<IEmailSender>(DI_TOKENS.EmailSender)
        )
    )
  );
}

// infrastructure/di/bootstrap.ts
// Registers all concrete implementations into the DI container.
// This is the ONLY file that imports both infrastructure classes and DI tokens together.
// Import this once at app startup (main.tsx), before any component renders.

import { GetPublishedPageBySlugUseCase } from "../../application/use-cases/pages/GetPublishedPageBySlugUseCase";
import { PingUseCase } from "../../application/use-cases/ping/PingUseCase";
import type { IPageRepository } from "../../domain/repositories/content/IPageRepository";
import { CloudinaryMediaUploader } from "../cloudinary/CloudinaryMediaUploader";
import { getDb } from "../firebase/firebaseClient";
import { FirestorePageRepository } from "../repositories/content/FirestorePageRepository";
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

  // ── Content repositories (Step 11) ──────────────────────────────────────────
  container.register(
    DI_TOKENS.PageRepository,
    singleton(() => new FirestorePageRepository())
  );

  // ── Use-cases (Step 11) ─────────────────────────────────────────────────────
  container.register(
    DI_TOKENS.GetPublishedPageBySlug,
    singleton(
      () =>
        new GetPublishedPageBySlugUseCase(
          container.resolve<IPageRepository>(DI_TOKENS.PageRepository)
        )
    )
  );
}

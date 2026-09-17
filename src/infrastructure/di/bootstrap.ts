// infrastructure/di/bootstrap.ts
// Registers all concrete implementations into the DI container.
// This is the ONLY file that imports both infrastructure classes and DI tokens together.
// Import this once at app startup (main.tsx), before any component renders.

import { PingUseCase } from "../../application/use-cases/ping/PingUseCase";
import { CloudinaryMediaUploader } from "../cloudinary/CloudinaryMediaUploader";
import { getDb } from "../firebase/firebaseClient";
import { getEnv } from "../system/env";
import { container, singleton } from "./container";
import { DI_TOKENS } from "./tokens";

/**
 * Bootstraps the DI container with all concrete bindings.
 *
 * Ordering: infrastructure registrations first, then use-cases that depend on them.
 * Steps 7–11 will add real repository and use-case registrations here.
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

  // ── Content repositories (registered in Step 11 once Firebase is ready) ────
  // container.register(DI_TOKENS.PageRepository, singleton(() => new FirestorePageRepository()));
  // container.register(DI_TOKENS.SectionRepository, singleton(() => new FirestoreSectionRepository()));
  // container.register(DI_TOKENS.MediaRepository, singleton(() => new FirestoreMediaRepository()));

  // ── Admin repositories (registered in Step 11) ──────────────────────────────
  // container.register(DI_TOKENS.AdminAccessRepository, singleton(() => new FirestoreAdminAccessRepository()));
  // container.register(DI_TOKENS.ContactRepository, singleton(() => new FirestoreContactRepository()));

  // ── Email sender (registered in Step 18) ────────────────────────────────────
  // container.register(DI_TOKENS.EmailSender, singleton(() => new EmailApiSender()));
}

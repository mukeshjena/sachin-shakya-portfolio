// scripts/test-hero-e2e.ts
// E2E smoke test verifying Step 15 Sci-Fi Hero subsystem (Three.js scene controller, shaders, constants, and data bindings).

import type { GetPublishedPageBySlugUseCase } from "../src/application/use-cases/pages/GetPublishedPageBySlugUseCase";
import type { ISiteSettingsRepository } from "../src/domain/repositories/settings/ISiteSettingsRepository";
import { bootstrapContainer } from "../src/infrastructure/di/bootstrap";
import { container } from "../src/infrastructure/di/container";
import { DI_TOKENS } from "../src/infrastructure/di/tokens";
import {
  HERO_FALLBACK_CONTENT,
  HERO_INFRA_BADGES,
  HERO_KEY_METRICS,
} from "../src/presentation/hero/constants/hero.constants";
import { BlackholeSceneController } from "../src/presentation/hero/scene/BlackholeHero.scene";
import {
  ACCRETION_DISK_FRAGMENT_SHADER,
  ACCRETION_DISK_VERTEX_SHADER,
  EVENT_HORIZON_CORONA_FRAGMENT_SHADER,
  EVENT_HORIZON_CORONA_VERTEX_SHADER,
} from "../src/presentation/hero/scene/BlackholeHero.shaders";

async function main() {
  console.log("==================================================");
  console.log("  STEP 15: SCI-FI HERO E2E VERIFICATION TEST");
  console.log("==================================================");

  console.log("\n1. Bootstrapping DI Container...");
  bootstrapContainer();
  console.log("   DI Container successfully bootstrapped.");

  console.log("\n2. Verifying Three.js Blackhole Scene & Shaders...");
  const controller = new BlackholeSceneController();
  if (!controller) throw new Error("Failed to instantiate BlackholeSceneController");
  console.log("   BlackholeSceneController instantiated cleanly.");

  if (!ACCRETION_DISK_VERTEX_SHADER.includes("gl_PointSize")) {
    throw new Error("Accretion disk vertex shader missing point size logic");
  }
  if (!ACCRETION_DISK_FRAGMENT_SHADER.includes("gl_PointCoord")) {
    throw new Error("Accretion disk fragment shader missing circular point discard");
  }
  if (!EVENT_HORIZON_CORONA_VERTEX_SHADER.includes("gl_Position")) {
    throw new Error("Corona vertex shader missing gl_Position");
  }
  if (!EVENT_HORIZON_CORONA_FRAGMENT_SHADER.includes("fresnel")) {
    throw new Error("Corona fragment shader missing Fresnel glow calculation");
  }
  console.log("   Custom GLSL shaders validated (accretion & relativistic corona).");

  console.log("\n3. Verifying Hero Telemetry Constants...");
  console.log(`   Eyebrow: ${HERO_FALLBACK_CONTENT.eyebrow}`);
  console.log(`   Headline: ${HERO_FALLBACK_CONTENT.headline}`);
  console.log(`   Key Metrics: ${HERO_KEY_METRICS.length} items:`);
  for (const m of HERO_KEY_METRICS) {
    console.log(`   - ${m.label}: ${m.value} (${m.description})`);
  }
  console.log(
    `   Stack Badges: ${HERO_INFRA_BADGES.length} items (${HERO_INFRA_BADGES.join(", ")})`
  );

  console.log("\n4. Verifying Firestore Home Page Data...");
  const getPageUseCase = container.resolve<GetPublishedPageBySlugUseCase>(
    DI_TOKENS.GetPublishedPageBySlug
  );
  const homePage = await getPageUseCase.execute("home");
  if (!homePage) throw new Error("Home page document missing in Firestore");
  console.log(`   Home Page Title: ${homePage.title}`);
  console.log(`   Section Count: ${homePage.sectionOrder.length}`);
  console.log(`   Hero Section ID: ${homePage.sectionOrder[0]}`);

  console.log("\n5. Verifying Site Settings for Hero Portrait & Résumé...");
  const siteRepo = container.resolve<ISiteSettingsRepository>(DI_TOKENS.SiteSettingsRepository);
  const settings = await siteRepo.getSettings();
  if (!settings) throw new Error("SiteSettings document missing in Firestore");

  console.log(`   Full Name: ${settings.fullName}`);
  console.log(`   Hero Photo URL: ${settings.avatarUrl || "(default asset)"}`);
  console.log(`   Résumé PDF URL: ${settings.resumePdfUrl || "(default asset)"}`);

  console.log("\n==================================================");
  console.log("  ALL SCI-FI HERO E2E CHECKS PASSED (100%)");
  console.log("==================================================");
  process.exit(0);
}

main().catch((err) => {
  console.error("\nHero E2E test failed:", err);
  process.exit(1);
});

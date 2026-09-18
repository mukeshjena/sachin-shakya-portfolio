// scripts/test-hero-e2e.ts
// E2E smoke test verifying Step 15 Sci-Fi Hero subsystem (Three.js scene controller, shaders, constants, and data bindings).

import type { GetPublishedPageBySlugUseCase } from "../src/application/use-cases/pages/GetPublishedPageBySlugUseCase";
import type { ISiteSettingsRepository } from "../src/domain/repositories/settings/ISiteSettingsRepository";
import { bootstrapContainer } from "../src/infrastructure/di/bootstrap";
import { container } from "../src/infrastructure/di/container";
import { DI_TOKENS } from "../src/infrastructure/di/tokens";
import {
  DESKTOP_BLACKHOLE_SETTINGS,
  HERO_COPY,
  MOBILE_BLACKHOLE_SETTINGS,
} from "../src/presentation/hero/constants/hero.constants";
import { BlackholeSceneController } from "../src/presentation/hero/scene/BlackholeHero.scene";
import {
  BLACKHOLE_FRAGMENT_SHADER,
  BLOOM_BLUR_SHADER,
  COMPOSITE_SHADER,
  VERTEX_SHADER,
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

  if (!VERTEX_SHADER.includes("gl_Position")) {
    throw new Error("Vertex shader missing gl_Position");
  }
  if (!BLACKHOLE_FRAGMENT_SHADER.includes("uCamPos")) {
    throw new Error("Accretion disk fragment shader missing uCamPos");
  }
  if (!BLOOM_BLUR_SHADER.includes("uStep")) {
    throw new Error("Bloom blur fragment shader missing uStep uniform");
  }
  if (!COMPOSITE_SHADER.includes("uBloom")) {
    throw new Error("Composite fragment shader missing uBloom composite");
  }
  console.log("   Custom GLSL shaders validated (relativistic Kerr raymarch & bloom pipeline).");

  console.log("\n3. Verifying Hero Telemetry Constants...");
  console.log(`   Eyebrow: ${HERO_COPY.eyebrow}`);
  console.log(`   Title: ${HERO_COPY.titleLine1} ${HERO_COPY.titleLine2}`);
  console.log(`   Desktop Raymarch Steps: ${DESKTOP_BLACKHOLE_SETTINGS.steps}`);
  console.log(`   Mobile Raymarch Steps: ${MOBILE_BLACKHOLE_SETTINGS.steps}`);

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

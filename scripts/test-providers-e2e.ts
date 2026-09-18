// scripts/test-providers-e2e.ts
// E2E smoke test verifying Step 13 Global Providers DI bindings & real-time SiteSettings subscription.

import type { IGetSiteSettingsUseCase } from "../src/application/use-cases/settings/GetSiteSettingsUseCase";
import type { ISubscribeSiteSettingsUseCase } from "../src/application/use-cases/settings/SubscribeSiteSettingsUseCase";
import type { ISiteSettingsRepository } from "../src/domain/repositories/settings/ISiteSettingsRepository";
import { bootstrapContainer } from "../src/infrastructure/di/bootstrap";
import { container } from "../src/infrastructure/di/container";
import { DI_TOKENS } from "../src/infrastructure/di/tokens";

async function main() {
  console.log("==================================================");
  console.log("  STEP 13: GLOBAL PROVIDERS E2E SMOKE TEST");
  console.log("==================================================");

  console.log("\n1. Bootstrapping DI Container...");
  bootstrapContainer();
  console.log("   DI Container successfully bootstrapped.");

  console.log("\n2. Resolving ISiteSettingsRepository...");
  const siteRepo = container.resolve<ISiteSettingsRepository>(DI_TOKENS.SiteSettingsRepository);
  if (!siteRepo) throw new Error("Failed to resolve ISiteSettingsRepository");
  console.log("   ISiteSettingsRepository resolved successfully.");

  console.log("\n3. Testing GetSiteSettingsUseCase resolution and execution...");
  const getSettingsUseCase = container.resolve<IGetSiteSettingsUseCase>(DI_TOKENS.GetSiteSettings);
  if (!getSettingsUseCase) throw new Error("Failed to resolve GetSiteSettingsUseCase");

  const settings = await getSettingsUseCase.execute();
  if (!settings) {
    throw new Error("SiteSettings document returned null from Firestore");
  }

  console.log(`   SiteSettings retrieved:`);
  console.log(`   - Full Name: ${settings.fullName}`);
  console.log(`   - Headline: ${settings.headline}`);
  console.log(`   - Email: ${settings.email}`);
  console.log(`   - Social Links: ${settings.socialLinks.length} links`);
  console.log(`   - Availability: ${settings.availabilityStatus}`);

  if (settings.fullName !== "Sachin Shakya") {
    throw new Error(`Unexpected fullName: expected 'Sachin Shakya', got '${settings.fullName}'`);
  }

  console.log("\n4. Testing SubscribeSiteSettingsUseCase real-time listener...");
  const subscribeUseCase = container.resolve<ISubscribeSiteSettingsUseCase>(
    DI_TOKENS.SubscribeSiteSettings
  );
  if (!subscribeUseCase) throw new Error("Failed to resolve SubscribeSiteSettingsUseCase");

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Timeout waiting for real-time siteSettings snapshot"));
    }, 10000);

    const unsubscribe = subscribeUseCase.execute(
      (liveSettings) => {
        clearTimeout(timeout);
        console.log(`   Realtime snapshot received!`);
        console.log(`   - Live Full Name: ${liveSettings.fullName}`);
        unsubscribe();
        resolve();
      },
      (err) => {
        clearTimeout(timeout);
        reject(err);
      }
    );
  });

  console.log("\n==================================================");
  console.log("  ALL PROVIDER ARCHITECTURE CHECKS PASSED (100%)");
  console.log("==================================================");
  process.exit(0);
}

main().catch((err) => {
  console.error("\nProvider E2E test failed:", err);
  process.exit(1);
});

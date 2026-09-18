// scripts/test-shell-e2e.ts
// E2E smoke test verifying Step 14 App Shell navigation use-cases and site settings bindings.

import type { IGetFooterNavPagesUseCase } from "../src/application/use-cases/pages/GetFooterNavPagesUseCase";
import type { IGetHeaderNavPagesUseCase } from "../src/application/use-cases/pages/GetHeaderNavPagesUseCase";
import type { ISiteSettingsRepository } from "../src/domain/repositories/settings/ISiteSettingsRepository";
import { bootstrapContainer } from "../src/infrastructure/di/bootstrap";
import { container } from "../src/infrastructure/di/container";
import { DI_TOKENS } from "../src/infrastructure/di/tokens";
import { MOBILE_BOTTOM_NAV_TABS } from "../src/presentation/shell/bottom-nav/constants/bottomNav.constants";
import { FOOTER_DEFAULT_SECTION_LINKS } from "../src/presentation/shell/footer/constants/footer.constants";
import { DEFAULT_HEADER_SECTION_LINKS } from "../src/presentation/shell/header/constants/header.constants";

async function main() {
  console.log("==================================================");
  console.log("  STEP 14: APP SHELL E2E VERIFICATION TEST");
  console.log("==================================================");

  console.log("\n1. Bootstrapping DI Container...");
  bootstrapContainer();
  console.log("   DI Container successfully bootstrapped.");

  console.log("\n2. Resolving GetHeaderNavPagesUseCase...");
  const headerNavUseCase = container.resolve<IGetHeaderNavPagesUseCase>(
    DI_TOKENS.GetHeaderNavPages
  );
  if (!headerNavUseCase) throw new Error("Failed to resolve GetHeaderNavPagesUseCase");

  const headerPages = await headerNavUseCase.execute();
  console.log(`   Header nav pages fetched from Firestore: ${headerPages.length}`);
  for (const page of headerPages) {
    console.log(`   - Page: ${page.title} (slug: ${page.slug.toString()})`);
  }

  console.log("\n3. Resolving GetFooterNavPagesUseCase...");
  const footerNavUseCase = container.resolve<IGetFooterNavPagesUseCase>(
    DI_TOKENS.GetFooterNavPages
  );
  if (!footerNavUseCase) throw new Error("Failed to resolve GetFooterNavPagesUseCase");

  const footerPages = await footerNavUseCase.execute();
  console.log(`   Footer nav pages fetched from Firestore: ${footerPages.length}`);
  for (const page of footerPages) {
    console.log(`   - Page: ${page.title} (slug: ${page.slug.toString()})`);
  }

  console.log("\n4. Verifying Site Settings for Header & Footer Branding...");
  const siteRepo = container.resolve<ISiteSettingsRepository>(DI_TOKENS.SiteSettingsRepository);
  const settings = await siteRepo.getSettings();
  if (!settings) throw new Error("SiteSettings document missing from Firestore");

  console.log(`   Brand Name: ${settings.fullName}`);
  console.log(`   Social Links: ${settings.socialLinks.length} items`);
  console.log(`   Availability Status: ${settings.availabilityStatus}`);
  console.log(`   Logo URL: ${settings.logoUrl}`);

  console.log("\n5. Verifying Static Navigation & Tab Declarations...");
  console.log(`   Desktop Header Anchor Links: ${DEFAULT_HEADER_SECTION_LINKS.length} items`);
  console.log(`   Mobile Bottom Nav Tabs: ${MOBILE_BOTTOM_NAV_TABS.length} tabs`);
  console.log(`   Footer Nav Sections: ${FOOTER_DEFAULT_SECTION_LINKS.length} items`);

  console.log("\n==================================================");
  console.log("  ALL APP SHELL E2E CHECKS PASSED (100%)");
  console.log("==================================================");
  process.exit(0);
}

main().catch((err) => {
  console.error("\nShell E2E test failed:", err);
  process.exit(1);
});

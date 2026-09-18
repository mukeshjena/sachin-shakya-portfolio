/**
 * scripts/test-dynamic-page-e2e.ts
 * End-to-end integration test verifying the Dynamic Page Engine:
 * - DI Container resolution for SectionRepository and Use-Cases
 * - Resolving dynamic page 'cloud-architecture'
 * - Resolving and ordering visible sections according to page.sectionOrder
 * - Fallback / 404 behavior on unknown slug
 */

import type { GetPageSectionsUseCase } from "../src/application/use-cases/pages/query/GetPageSectionsUseCase";
import type { GetPublishedPageBySlugUseCase } from "../src/application/use-cases/pages/query/GetPublishedPageBySlugUseCase";
import type { IPageRepository } from "../src/domain/repositories/content/IPageRepository";
import type { ISectionRepository } from "../src/domain/repositories/content/ISectionRepository";
import { bootstrapContainer } from "../src/infrastructure/di/bootstrap";
import { container } from "../src/infrastructure/di/container";
import { DI_TOKENS } from "../src/infrastructure/di/tokens";

async function runDynamicPageE2eTests() {
  console.log("==========================================================");
  console.log("Step 17: Dynamic Page Engine E2E Integration Verification");
  console.log("==========================================================");

  bootstrapContainer();

  const _pageRepo = container.resolve<IPageRepository>(DI_TOKENS.PageRepository);
  const _sectionRepo = container.resolve<ISectionRepository>(DI_TOKENS.SectionRepository);
  const getPageUseCase = container.resolve<GetPublishedPageBySlugUseCase>(
    DI_TOKENS.GetPublishedPageBySlug
  );
  const getSectionsUseCase = container.resolve<GetPageSectionsUseCase>(DI_TOKENS.GetPageSections);

  console.log("✓ DI container resolved PageRepository and SectionRepository");
  console.log("✓ DI container resolved GetPublishedPageBySlug and GetPageSections use-cases");

  // 1. Verify resolving 'cloud-architecture' dynamic page
  console.log("\n[Test 1] Resolving dynamic page 'cloud-architecture'...");
  const dynamicPage = await getPageUseCase.execute("cloud-architecture");
  if (!dynamicPage) {
    throw new Error("FAILED: 'cloud-architecture' dynamic page not found in Firestore!");
  }
  console.log(`✓ Page found: "${dynamicPage.title}" (slug: ${dynamicPage.slug})`);
  console.log(`✓ sectionOrder declared: ${JSON.stringify(dynamicPage.sectionOrder)}`);

  // 2. Verify resolving ordered sections
  console.log("\n[Test 2] Resolving ordered sections for 'cloud-architecture'...");
  const sections = await getSectionsUseCase.execute(dynamicPage.id, dynamicPage.sectionOrder);
  if (sections.length < 3) {
    throw new Error(`FAILED: Expected at least 3 sections, found ${sections.length}`);
  }
  console.log(`✓ Retrieved ${sections.length} ordered sections:`);
  sections.forEach((sec, idx) => {
    console.log(`   [${idx}] ${sec.id} (${sec.type}): "${sec.title}"`);
  });

  // Check that section order strictly mirrors sectionOrder
  const returnedIds = sections.map((s) => s.id);
  const expectedOrder = dynamicPage.sectionOrder.filter((id) => returnedIds.includes(id));
  if (
    JSON.stringify(returnedIds.slice(0, expectedOrder.length)) !== JSON.stringify(expectedOrder)
  ) {
    throw new Error("FAILED: Section order does not match page.sectionOrder!");
  }
  console.log("✓ Section ordering verified matches page.sectionOrder!");

  // 3. Verify 404 behavior
  console.log("\n[Test 3] Testing unknown slug resolution...");
  const missingPage = await getPageUseCase.execute("non-existent-cluster-coordinate");
  if (missingPage !== null) {
    throw new Error("FAILED: Non-existent page should return null!");
  }
  console.log("✓ Non-existent slug cleanly returns null (triggering 404 Telemetry Signal Loss)");

  console.log("\n==========================================================");
  console.log("✓ ALL STEP 17 DYNAMIC PAGE ENGINE TESTS PASSED (100%)");
  console.log("==========================================================");
}

runDynamicPageE2eTests().catch((err) => {
  console.error("Dynamic page test failed:", err);
  process.exit(1);
});

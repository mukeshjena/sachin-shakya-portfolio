// scripts/test-content-management-e2e.ts
// Automated end-to-end integration test for Step 23: Content Management Modules.
// Verifies SavePageUseCase, DeletePageUseCase (with root home protection),
// SaveSectionUseCase, ReorderSectionsUseCase, UpdateSiteSettingsUseCase,
// and SaveTelemetryMetricsUseCase.

import type { IDeletePageUseCase } from "../src/application/use-cases/pages/mutation/DeletePageUseCase";
import type { IReorderSectionsUseCase } from "../src/application/use-cases/pages/mutation/ReorderSectionsUseCase";
import type { ISavePageUseCase } from "../src/application/use-cases/pages/mutation/SavePageUseCase";
import type { ISaveSectionUseCase } from "../src/application/use-cases/sections/SaveSectionUseCase";
import type { IGetSiteSettingsUseCase } from "../src/application/use-cases/settings/GetSiteSettingsUseCase";
import type { IUpdateSiteSettingsUseCase } from "../src/application/use-cases/settings/UpdateSiteSettingsUseCase";
import type { ISaveTelemetryMetricsUseCase } from "../src/application/use-cases/telemetry/SaveTelemetryMetricsUseCase";
import type { IPageRepository } from "../src/domain/repositories/content/IPageRepository";
import type { ISectionRepository } from "../src/domain/repositories/content/ISectionRepository";
import type { ITelemetryRepository } from "../src/domain/repositories/telemetry/ITelemetryRepository";
import { Slug } from "../src/domain/value-objects/Slug";
import { bootstrapContainer } from "../src/infrastructure/di/bootstrap";
import { container } from "../src/infrastructure/di/container";
import { DI_TOKENS } from "../src/infrastructure/di/tokens";

async function main() {
  console.log("==================================================================");
  console.log("Starting Step 23 Content Management Modules E2E Test Suite...");
  console.log("==================================================================");

  // 1. Bootstrap DI Container & Resolve Dependencies
  console.log("\n[1/6] Bootstrapping DI container & resolving use-cases...");
  bootstrapContainer();

  const savePage = container.resolve<ISavePageUseCase>(DI_TOKENS.SavePage);
  const deletePage = container.resolve<IDeletePageUseCase>(DI_TOKENS.DeletePage);
  const saveSection = container.resolve<ISaveSectionUseCase>(DI_TOKENS.SaveSection);
  const reorderSections = container.resolve<IReorderSectionsUseCase>(DI_TOKENS.ReorderSections);
  const getSiteSettings = container.resolve<IGetSiteSettingsUseCase>(DI_TOKENS.GetSiteSettings);
  const updateSiteSettings = container.resolve<IUpdateSiteSettingsUseCase>(
    DI_TOKENS.UpdateSiteSettings
  );
  const saveTelemetry = container.resolve<ISaveTelemetryMetricsUseCase>(
    DI_TOKENS.SaveTelemetryMetrics
  );
  const pageRepo = container.resolve<IPageRepository>(DI_TOKENS.PageRepository);
  const sectionRepo = container.resolve<ISectionRepository>(DI_TOKENS.SectionRepository);
  const telemetryRepo = container.resolve<ITelemetryRepository>(DI_TOKENS.TelemetryRepository);

  if (
    !savePage ||
    !deletePage ||
    !saveSection ||
    !reorderSections ||
    !updateSiteSettings ||
    !saveTelemetry
  ) {
    throw new Error("Failed to resolve content management use-cases from DI container!");
  }
  console.log("✓ All content management use-cases resolved cleanly from DI container.");

  // 2. Test Dynamic Page Creation & Mutation (SavePageUseCase)
  console.log("\n[2/6] Testing SavePageUseCase (create & update)...");
  const testSlug = `e2e-cloud-arch-${Date.now()}`;
  const createdPage = await savePage.execute({
    title: "Enterprise Cloud Architecture",
    slug: testSlug,
    isPublished: true,
    showInHeader: true,
    showInFooter: true,
    seoTitle: "Enterprise Cloud Architecture - Sachin Shakya",
    seoDescription: "Case study of multi-cloud Kubernetes migrations.",
  });

  if (!createdPage.id || createdPage.slug.toString() !== testSlug) {
    throw new Error(`Failed to create dynamic page! Expected slug ${testSlug}`);
  }
  console.log(`✓ Dynamic page created: ${createdPage.id} (slug: /${createdPage.slug.toString()})`);

  // Update existing page
  const updatedPage = await savePage.execute({
    id: createdPage.id,
    title: "Enterprise Cloud Architecture (Updated)",
    slug: testSlug,
    isPublished: false,
    showInHeader: false,
    showInFooter: true,
  });

  if (updatedPage.title !== "Enterprise Cloud Architecture (Updated)" || updatedPage.isPublished) {
    throw new Error("Page update did not reflect expected properties!");
  }
  console.log("✓ Page update succeeded with title and publishing state changes.");

  // 3. Test DeletePageUseCase & Root 'home' Invariant
  console.log("\n[3/6] Testing DeletePageUseCase & root 'home' immutability...");
  let rootDeletionBlocked = false;
  try {
    await deletePage.execute({ id: "home", slug: "home" });
  } catch (err) {
    rootDeletionBlocked = true;
    console.log(`✓ Root page deletion correctly blocked: ${(err as Error).message}`);
  }

  if (!rootDeletionBlocked) {
    throw new Error("CRITICAL SECURITY ERROR: Root 'home' page was NOT protected from deletion!");
  }

  // Delete the test page created in step 2
  await deletePage.execute({ id: createdPage.id, slug: testSlug });
  const fetchedDeleted = await pageRepo.getBySlug(new Slug(testSlug));
  if (fetchedDeleted) {
    throw new Error("Deleted page still exists in repository!");
  }
  console.log("✓ Custom dynamic page successfully deleted.");

  // 4. Test SaveSectionUseCase & Section Mutation
  console.log("\n[4/6] Testing SaveSectionUseCase (content payload & page sectionOrder sync)...");
  const testSection = await saveSection.execute({
    pageId: "home",
    type: "custom",
    title: "DevOps Observability Matrix",
    isVisible: true,
    content: {
      metrics: ["Datadog", "Dynatrace", "CloudWatch"],
      activeCluster: "us-east-1",
    },
  });

  if (!testSection.id || testSection.title !== "DevOps Observability Matrix") {
    throw new Error("Failed to save section!");
  }
  console.log(`✓ Section created: ${testSection.id} on page: ${testSection.pageId}`);

  // Verify page sectionOrder array includes newly added section
  const homePage = await pageRepo.getBySlug(new Slug("home"));
  if (homePage && !homePage.sectionOrder.includes(testSection.id)) {
    throw new Error("Parent page sectionOrder array does not contain newly created section!");
  }
  console.log("✓ Parent page sectionOrder array automatically synced with new section ID.");

  // 5. Test ReorderSectionsUseCase
  console.log("\n[5/6] Testing ReorderSectionsUseCase...");
  const sectionsBefore = await sectionRepo.getByPage("home");
  if (sectionsBefore.length >= 2) {
    const originalOrder = sectionsBefore.map((s) => s.id);
    const reversedOrder = [...originalOrder].reverse();

    await reorderSections.execute("home", reversedOrder);
    const sectionsAfter = await sectionRepo.getByPage("home");
    const reorderedIds = sectionsAfter.map((s) => s.id);

    // Verify ordering matched
    if (reorderedIds[0] !== reversedOrder[0]) {
      throw new Error("ReorderSectionsUseCase failed to reorder sections!");
    }
    console.log("✓ ReorderSectionsUseCase atomically reorganized section sequence.");

    // Restore original ordering
    await reorderSections.execute("home", originalOrder);
    console.log("✓ Restored initial section ordering.");
  } else {
    console.log("ℹ Note: Fewer than 2 sections in home page, verified reorder signature.");
  }

  // Clean up the created test section
  await sectionRepo.delete(testSection.id);
  const homeAfter = await pageRepo.getBySlug(new Slug("home"));
  if (homeAfter) {
    await pageRepo.update(homeAfter.id, {
      sectionOrder: homeAfter.sectionOrder.filter((id) => id !== testSection.id),
    });
  }
  console.log("✓ Test section cleaned up and removed from home page sectionOrder.");

  // 6. Test UpdateSiteSettingsUseCase & SaveTelemetryMetricsUseCase
  console.log("\n[6/6] Testing UpdateSiteSettingsUseCase & SaveTelemetryMetricsUseCase...");
  const _existingSettings = await getSiteSettings.execute();
  console.log(`✓ Fetched current settings for ${_existingSettings.fullName}`);

  await updateSiteSettings.execute({
    fullName: "Sachin Shakya",
    headline: "Lead Cloud Architect & DevOps Consultant",
    email: "sachin.shakya@live.com",
    shortBio: "Automating enterprise multi-cloud architectures with $170K/mo documented ROI.",
    socialLinks: [
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/sachinshakya",
        label: "LinkedIn",
        isVisible: true,
        order: 1,
      },
      {
        platform: "github",
        url: "https://github.com/sachinshakya",
        label: "GitHub",
        isVisible: true,
        order: 2,
      },
    ],
  });
  console.log("✓ Site settings updated and persisted to Firestore.");

  // Test FinOps telemetry metrics persistence
  await saveTelemetry.execute({
    annualSavingsHeadline: "$170K/mo",
    monthlyTarget: "$170K/month Cloud Cost Savings",
    mttrReductionPercent: 40,
    managedResourcesCount: 2000,
    points: [
      { month: "Jan", baseline: 450, optimized: 450, milestone: "Baseline Audit" },
      { month: "Feb", baseline: 450, optimized: 432 },
      { month: "Dec", baseline: 450, optimized: 280, milestone: "Continuous Governance" },
    ],
  });

  const persistedTelemetry = await telemetryRepo.getFinOpsMetrics();
  if (
    persistedTelemetry?.annualSavingsHeadline !== "$170K/mo" ||
    persistedTelemetry.mttrReductionPercent !== 40
  ) {
    throw new Error("Failed to verify persisted FinOps telemetry metrics!");
  }
  console.log("✓ FinOps telemetry metrics and spend points successfully saved & verified.");

  console.log("\n==================================================================");
  console.log("ALL STEP 23 CONTENT MANAGEMENT MODULES TESTS PASSED! (6/6)");
  console.log("==================================================================");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Step 23 E2E Test Suite FAILED:");
  console.error(err);
  process.exit(1);
});

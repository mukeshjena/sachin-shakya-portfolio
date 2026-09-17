/**
 * scripts/test-pipeline-e2e.ts
 * Integration test for Step 11: Clean Architecture Layers Wired End-to-End.
 * Verifies that the DI container resolves the use-case and returns real Firestore data.
 */

import type { GetPublishedPageBySlugUseCase } from "../src/application/use-cases/pages/GetPublishedPageBySlugUseCase";
import { bootstrapContainer } from "../src/infrastructure/di/bootstrap";
import { container } from "../src/infrastructure/di/container";
import { DI_TOKENS } from "../src/infrastructure/di/tokens";

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch {
    // Ignore if already loaded
  }
}

async function testCleanArchitecturePipeline(): Promise<void> {
  console.log("==========================================================");
  console.log("Testing Clean Architecture Pipeline End-to-End (Step 11)");
  console.log("==========================================================");

  try {
    // 1. Initialize DI Container
    console.log("1. Bootstrapping DI container...");
    bootstrapContainer();
    console.log("✓ Container initialized with repositories and use-cases.");

    // 2. Resolve Use-Case from Container
    console.log("2. Resolving GetPublishedPageBySlugUseCase from DI container...");
    const useCase = container.resolve<GetPublishedPageBySlugUseCase>(
      DI_TOKENS.GetPublishedPageBySlug
    );

    if (!useCase) {
      throw new Error("Failed to resolve GetPublishedPageBySlugUseCase from container!");
    }
    console.log("✓ Use-case resolved successfully.");

    // 3. Execute with real seeded 'home' page slug
    console.log("3. Executing use-case for slug: 'home'...");
    const homePage = await useCase.execute("home");

    if (!homePage) {
      throw new Error(
        "Expected 'home' page to be returned from Firestore, but got null. Has 'npm run seed' been run?"
      );
    }

    console.log("\n--- Real Firestore Telemetry Data Received ---");
    console.log(`Document ID:   ${homePage.id}`);
    console.log(`Slug:          ${homePage.slug}`);
    console.log(`Title:         ${homePage.title}`);
    console.log(`Published:     ${homePage.isPublished}`);
    console.log(`Section Count: ${homePage.sectionOrder.length}`);
    console.log(`Sections:      [${homePage.sectionOrder.join(", ")}]`);
    console.log(`SEO Title:     ${homePage.seoTitle}`);
    console.log(`Created At:    ${homePage.createdAt}`);
    console.log("----------------------------------------------\n");

    // Invariants check
    if (homePage.slug !== "home") {
      throw new Error(`Expected slug 'home', got '${homePage.slug}'`);
    }
    if (!homePage.isPublished) {
      throw new Error("Expected home page to be published");
    }
    if (homePage.sectionOrder.length === 0) {
      throw new Error("Expected non-empty sectionOrder");
    }

    // 4. Test handling of non-existent page
    console.log("4. Testing query for non-existent slug: 'missing-page'...");
    const missingPage = await useCase.execute("missing-page");
    if (missingPage !== null) {
      throw new Error(`Expected null for missing page, got: ${JSON.stringify(missingPage)}`);
    }
    console.log("✓ Non-existent page correctly returned null.");

    console.log("\n==========================================================");
    console.log("✓ ALL CLEAN ARCHITECTURE E2E PIPELINE TESTS PASSED!");
    console.log("==========================================================");
    process.exit(0);
  } catch (error) {
    console.error("\n✗ Clean Architecture Pipeline test failed:", error);
    process.exit(1);
  }
}

testCleanArchitecturePipeline();

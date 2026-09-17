/**
 * scripts/seed/seed.ts
 * Master idempotent database and media seeder for Sachin Shakya Portfolio.
 * Orchestrates media seeding first, then feeds resulting CDN URLs into Firestore content seeding.
 */

import { seedContent } from "./seed-content";
import { seedMediaAssets } from "./seed-media";

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch {
    // Ignore if already loaded
  }
}

async function runMasterSeed(): Promise<void> {
  const startTime = Date.now();
  console.log("==========================================================");
  console.log("Starting Master Database & Telemetry Seeder");
  console.log("==========================================================");

  try {
    // 1. Seed media first so live Cloudinary URLs are available
    const mediaMap = await seedMediaAssets();

    // 2. Seed content collections referencing real media URLs
    await seedContent(mediaMap);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✓ Seeding completed in ${elapsed}s with ZERO duplicates!`);
    console.log("==========================================================");
    process.exit(0);
  } catch (error) {
    console.error("\n✗ Seeding failed with error:", error);
    process.exit(1);
  }
}

runMasterSeed();

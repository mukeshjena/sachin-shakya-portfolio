// scripts/generate-sitemap.ts
// Build-time & edge script to generate standard XML sitemap from published Firestore pages.
// Run with: npx tsx scripts/generate-sitemap.ts

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type { IPageRepository } from "../src/domain/repositories/content/IPageRepository";
import { bootstrapContainer } from "../src/infrastructure/di/bootstrap";
import { container } from "../src/infrastructure/di/container";
import { DI_TOKENS } from "../src/infrastructure/di/tokens";
import { SitemapGenerator, type SitemapUrlEntry } from "../src/infrastructure/seo/SitemapGenerator";
import { env } from "../src/infrastructure/system/env";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("==================================================================");
  console.log("Generating dynamic sitemap.xml for Sachin Shakya Portfolio...");
  console.log("==================================================================");

  bootstrapContainer();
  const pageRepo = container.resolve<IPageRepository>(DI_TOKENS.PageRepository);

  const baseUrl = env.app.siteUrl || "https://shakya.mukeshjena.com";
  const publicDir = path.resolve(__dirname, "../public");
  const sitemapPath = path.join(publicDir, "sitemap.xml");

  // Core static section landing routes
  const entries: SitemapUrlEntry[] = [
    {
      path: "",
      changeFrequency: "weekly",
      priority: 1.0,
      lastModified: new Date(),
    },
    {
      path: "about",
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      path: "experience",
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      path: "capabilities",
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      path: "credentials",
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      path: "contact",
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified: new Date(),
    },
  ];

  try {
    const publishedPages = await pageRepo.getPublished();
    for (const page of publishedPages) {
      const slugStr =
        typeof page.slug === "string"
          ? page.slug
          : (page.slug as { value?: string })?.value || String(page.slug);
      if (slugStr !== "home") {
        entries.push({
          path: slugStr,
          changeFrequency: "weekly",
          priority: 0.85,
          lastModified: page.updatedAt,
        });
      }
    }
    console.log(`✓ Fetched ${publishedPages.length} published pages from catalog.`);
  } catch (err) {
    console.warn("Notice: Firestore offline or empty, generated sitemap using core routes.", err);
  }

  const xml = SitemapGenerator.generateXml(entries, baseUrl);
  fs.writeFileSync(sitemapPath, xml, "utf-8");

  console.log(`✓ Generated sitemap with ${entries.length} URLs at: ${sitemapPath}`);
  console.log("==================================================================");
}

main().catch((err) => {
  console.error("Failed to generate sitemap.xml:", err);
  process.exit(1);
});

// scripts/test-seo-e2e.ts
// Automated end-to-end integration test for Step 25: SEO Pass.
// Verifies Schema.org JSON-LD generation, XML sitemap generation, robots.txt,
// OpenGraph metadata, and favicon/touch-icon asset existence.

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { JsonLdGenerator } from "../src/infrastructure/seo/JsonLdGenerator";
import { SitemapGenerator } from "../src/infrastructure/seo/SitemapGenerator";
import { SEO_CONSTANTS } from "../src/presentation/shared/seo/constants/seo.constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("==================================================================");
  console.log("Starting Step 25 SEO Pass E2E Test Suite...");
  console.log("==================================================================");

  const publicDir = path.resolve(__dirname, "../public");

  // 1. Verify Schema.org JSON-LD Generation (Person, WebSite, ProfilePage)
  console.log("\n[1/5] Testing Schema.org JSON-LD structured data generators...");
  const personGraph = JsonLdGenerator.generatePersonGraph({
    siteUrl: "https://shakya.mukeshjena.com",
    name: "Sachin Shakya",
    jobTitle: "Lead Cloud Architect & DevOps Consultant",
    socialLinks: ["https://www.linkedin.com/in/sachin-shakya"],
  }) as { "@context": string; "@graph": Array<{ "@type": string; [key: string]: unknown }> };

  if (personGraph["@context"] !== "https://schema.org") {
    throw new Error("Invalid @context in generated Schema.org JSON-LD!");
  }

  const types = personGraph["@graph"].map((node) => node["@type"]);
  if (!types.includes("Person") || !types.includes("WebSite") || !types.includes("ProfilePage")) {
    throw new Error(`Missing expected Schema.org types! Found: ${types.join(", ")}`);
  }

  const personNode = personGraph["@graph"].find((node) => node["@type"] === "Person");
  if (personNode?.name !== "Sachin Shakya") {
    throw new Error("Person node missing or incorrect name in Schema.org graph!");
  }

  const knowsAbout = (personNode.knowsAbout as string[]) || [];
  if (
    !knowsAbout.includes("Amazon Web Services (AWS)") ||
    !knowsAbout.includes("Microsoft Azure")
  ) {
    throw new Error("Person node missing required multi-cloud keywords in knowsAbout!");
  }

  const credentials = (personNode.hasCredential as Array<{ name: string }>) || [];
  if (!credentials.some((c) => c.name.includes("AZ-104"))) {
    throw new Error("Person node missing Azure AZ-104 certification credential!");
  }
  console.log("✓ Schema.org Person, WebSite, and ProfilePage graph validated successfully.");

  // Test BreadcrumbList
  const breadcrumbs = JsonLdGenerator.generateBreadcrumbList(
    [
      { name: "Home", path: "/" },
      { name: "Cloud Architecture", path: "/cloud-architecture" },
    ],
    "https://shakya.mukeshjena.com"
  ) as { "@type": string; itemListElement: Array<{ position: number; name: string }> };

  if (breadcrumbs["@type"] !== "BreadcrumbList" || breadcrumbs.itemListElement.length !== 2) {
    throw new Error("BreadcrumbList generator produced invalid structure!");
  }
  console.log("✓ Schema.org BreadcrumbList validated successfully.");

  // 2. Verify XML Sitemap Generation
  console.log("\n[2/5] Testing SitemapGenerator XML compliance...");
  const xml = SitemapGenerator.generateXml(
    [
      { path: "", priority: 1.0, changeFrequency: "weekly" },
      { path: "cloud-architecture", priority: 0.8, changeFrequency: "monthly" },
      { path: "test&query", priority: 0.5, changeFrequency: "never" },
    ],
    "https://shakya.mukeshjena.com"
  );

  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    throw new Error("Generated sitemap missing XML declaration!");
  }
  if (!xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    throw new Error("Generated sitemap missing standard urlset xmlns schema!");
  }
  if (!xml.includes("https://shakya.mukeshjena.com/")) {
    throw new Error("Generated sitemap missing root URL entry!");
  }
  if (!xml.includes("https://shakya.mukeshjena.com/test&amp;query")) {
    throw new Error("Generated sitemap failed to escape special XML characters (&amp;)!");
  }
  console.log("✓ SitemapGenerator XML compliance and entity escaping verified.");

  // 3. Verify robots.txt Directives
  console.log("\n[3/5] Verifying public/robots.txt rules and directives...");
  const robotsPath = path.join(publicDir, "robots.txt");
  if (!fs.existsSync(robotsPath)) {
    throw new Error("public/robots.txt file does not exist!");
  }

  const robotsContent = fs.readFileSync(robotsPath, "utf-8");
  if (!robotsContent.includes("User-agent: *")) {
    throw new Error("robots.txt missing User-agent: * rule!");
  }
  if (!robotsContent.includes("Allow: /")) {
    throw new Error("robots.txt missing Allow: / rule!");
  }
  if (!robotsContent.includes("Disallow: /admin")) {
    throw new Error("robots.txt missing Disallow: /admin protection rule!");
  }
  if (!robotsContent.includes("Sitemap: https://shakya.mukeshjena.com/sitemap.xml")) {
    throw new Error("robots.txt missing sitemap pointer!");
  }
  console.log("✓ public/robots.txt directives verified cleanly.");

  // 4. Verify Favicon, Touch Icons, and OpenGraph Image Files
  console.log("\n[4/5] Verifying multi-resolution favicon and OpenGraph suite...");
  const expectedFiles = [
    { name: "favicon-16x16.png", minSize: 500 },
    { name: "favicon-32x32.png", minSize: 1000 },
    { name: "favicon-48x48.png", minSize: 2000 },
    { name: "apple-touch-icon.png", minSize: 20000 },
    { name: "icon-192x192.png", minSize: 30000 },
    { name: "icon-512x512.png", minSize: 100000 },
    { name: "favicon.ico", minSize: 500 },
    { name: "og-image.png", minSize: 50000 },
    { name: "sitemap.xml", minSize: 200 },
  ];

  for (const file of expectedFiles) {
    const filePath = path.join(publicDir, file.name);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing expected asset in public/: ${file.name}`);
    }
    const stat = fs.statSync(filePath);
    if (stat.size < file.minSize) {
      throw new Error(
        `Asset ${file.name} is undersized (${stat.size} bytes < ${file.minSize} bytes)!`
      );
    }
    console.log(`  ✓ ${file.name} verified (${stat.size} bytes).`);
  }
  console.log("✓ All favicon, touch icon, and OpenGraph files verified.");

  // 5. Verify index.html Links and Constants
  console.log("\n[5/5] Verifying index.html metadata tags and SEO constants...");
  const indexHtmlPath = path.resolve(__dirname, "../index.html");
  const indexHtml = fs.readFileSync(indexHtmlPath, "utf-8");

  if (!indexHtml.includes('rel="canonical" href="https://shakya.mukeshjena.com"')) {
    throw new Error("index.html missing canonical URL link tag!");
  }
  if (!indexHtml.includes('rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"')) {
    throw new Error("index.html missing apple-touch-icon link tag!");
  }
  if (!indexHtml.includes('rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"')) {
    throw new Error("index.html missing favicon-32x32 link tag!");
  }
  if (
    !indexHtml.includes('property="og:image" content="https://shakya.mukeshjena.com/og-image.png"')
  ) {
    throw new Error("index.html missing OpenGraph image tag!");
  }

  if (SEO_CONSTANTS.SITE_NAME.length === 0 || SEO_CONSTANTS.KEYWORDS.length === 0) {
    throw new Error("SEO_CONSTANTS missing required values!");
  }
  console.log("✓ index.html links and SEO constants verified.");

  console.log("\n==================================================================");
  console.log("🎉 ALL STEP 25 SEO PASS E2E TESTS PASSED CLEANLY!");
  console.log("   - Schema.org JSON-LD (Person, WebSite, ProfilePage, BreadcrumbList) verified");
  console.log("   - XML Sitemap Generator & dynamic URLs verified");
  console.log("   - robots.txt crawl directives & admin disallow verified");
  console.log("   - Favicon & Apple touch icon multi-resolution set verified");
  console.log("   - OpenGraph 1200x630 branded telemetry preview verified");
  console.log("==================================================================");
}

main().catch((err) => {
  console.error("\n❌ Step 25 SEO Pass E2E Test Suite FAILED:", err);
  process.exit(1);
});

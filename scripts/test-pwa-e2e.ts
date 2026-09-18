/**
 * Automated PWA E2E Verification Script
 * Validates Web App Manifest, Service Worker configuration, icon assets,
 * Clean Architecture layer constraints, and shadow-free styling rules.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();

interface CheckResult {
  title: string;
  passed: boolean;
  details?: string;
}

const results: CheckResult[] = [];

function assert(condition: boolean, title: string, details?: string): void {
  results.push({ title, passed: condition, details });
}

// 1. Manifest verification
console.log("Validating public/manifest.webmanifest...");
const manifestPath = path.join(ROOT_DIR, "public", "manifest.webmanifest");
const manifestExists = fs.existsSync(manifestPath);
assert(manifestExists, "public/manifest.webmanifest exists");

if (manifestExists) {
  try {
    const raw = fs.readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(raw);
    assert(
      manifest.name === "Sachin Shakya — Lead Cloud Architect & DevOps Consultant",
      "Manifest name matches official brand title"
    );
    assert(manifest.short_name === "Sachin Shakya", "Manifest short_name matches");
    assert(manifest.start_url === "/", "Manifest start_url is root");
    assert(manifest.display === "standalone", "Manifest display is standalone");
    assert(manifest.theme_color === "#06121a", "Manifest theme_color matches --ink-900 token");
    assert(
      manifest.background_color === "#06121a",
      "Manifest background_color matches --ink-900 token"
    );

    // Verify icons
    const icons = manifest.icons || [];
    assert(icons.length >= 4, "Manifest contains at least 4 icon definitions");

    let hasMaskable = false;
    for (const icon of icons) {
      if (icon.purpose === "maskable") hasMaskable = true;
      const localFile = path.join(ROOT_DIR, "public", icon.src.replace(/^\//, ""));
      assert(fs.existsSync(localFile), `Icon asset exists: ${icon.src}`);
    }
    assert(hasMaskable, "Manifest contains at least one maskable icon");
  } catch (err) {
    assert(false, "Manifest parses valid JSON", String(err));
  }
}

// 2. index.html PWA tags
console.log("Validating index.html PWA tags...");
const indexPath = path.join(ROOT_DIR, "index.html");
const indexContent = fs.readFileSync(indexPath, "utf-8");
assert(indexContent.includes('rel="manifest"'), "index.html links to manifest");
assert(
  indexContent.includes('name="theme-color" content="#06121a"'),
  "index.html includes theme-color meta tag"
);
assert(
  indexContent.includes('name="mobile-web-app-capable"'),
  "index.html includes mobile-web-app-capable"
);
assert(
  indexContent.includes('name="apple-mobile-web-app-capable"'),
  "index.html includes apple-mobile-web-app-capable"
);

// 3. vite.config.ts PWA configuration
console.log("Validating vite.config.ts PWA workbox caching...");
const viteConfigPath = path.join(ROOT_DIR, "vite.config.ts");
const viteConfig = fs.readFileSync(viteConfigPath, "utf-8");
assert(viteConfig.includes("VitePWA"), "vite.config.ts configures VitePWA");
assert(viteConfig.includes('registerType: "autoUpdate"'), "vite.config.ts sets autoUpdate");
assert(viteConfig.includes("google-fonts-cache"), "vite.config.ts configures google-fonts-cache");
assert(
  viteConfig.includes("cloudinary-media-cache"),
  "vite.config.ts configures cloudinary-media-cache"
);

// 4. Clean Architecture & Rule 4 folder constraints
console.log("Validating Clean Architecture file constraints (Rule 4: ≤ 3 files per folder)...");
const infraPwaDir = path.join(ROOT_DIR, "src", "infrastructure", "pwa");
const infraPwaFiles = fs
  .readdirSync(infraPwaDir)
  .filter((f) => !fs.statSync(path.join(infraPwaDir, f)).isDirectory());
assert(
  infraPwaFiles.length <= 3,
  `src/infrastructure/pwa/ has ≤ 3 files (actual: ${infraPwaFiles.length})`
);

const presPwaDir = path.join(ROOT_DIR, "src", "presentation", "shared", "pwa");
const presPwaFiles = fs
  .readdirSync(presPwaDir)
  .filter((f) => !fs.statSync(path.join(presPwaDir, f)).isDirectory());
assert(
  presPwaFiles.length <= 3,
  `src/presentation/shared/pwa/ has ≤ 3 files (actual: ${presPwaFiles.length})`
);

// 5. Aesthetic rules: Zero box-shadow and zero emojis
console.log("Validating zero box-shadow and zero emojis...");
const cssPath = path.join(presPwaDir, "PwaInstallPrompt.css");
const cssContent = fs.readFileSync(cssPath, "utf-8");
assert(!cssContent.includes("box-shadow"), "PwaInstallPrompt.css strictly shadow-free");

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
const tsxPath = path.join(presPwaDir, "PwaInstallPrompt.tsx");
const tsxContent = fs.readFileSync(tsxPath, "utf-8");
assert(!emojiRegex.test(tsxContent), "PwaInstallPrompt.tsx has zero emojis");

const constPath = path.join(presPwaDir, "constants", "pwa.constants.ts");
const constContent = fs.readFileSync(constPath, "utf-8");
assert(!emojiRegex.test(constContent), "pwa.constants.ts has zero emojis");

// Summary Report
console.log("\n==========================================");
console.log("         PWA E2E TEST REPORT              ");
console.log("==========================================");

let totalPassed = 0;
for (const res of results) {
  if (res.passed) {
    totalPassed++;
    console.log(`[PASS] ${res.title}`);
  } else {
    console.error(`[FAIL] ${res.title}${res.details ? ` - ${res.details}` : ""}`);
  }
}

console.log(`\nResult: ${totalPassed}/${results.length} checks passed.`);

if (totalPassed !== results.length) {
  process.exit(1);
}
console.log("PWA E2E verification successfully passed!");

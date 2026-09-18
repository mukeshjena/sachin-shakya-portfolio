/**
 * Automated Audit Gate Verification Script (Step 27)
 * Strictly verifies zero box-shadow, zero debounce, zero emojis,
 * max 500 lines per file, and max 3 files per directory across src/.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();
const SRC_DIR = path.join(ROOT_DIR, "src");

interface CheckResult {
  title: string;
  passed: boolean;
  details?: string[];
}

const results: CheckResult[] = [];

function getAllFiles(dir: string, extensions: string[]): string[] {
  let fileList: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fileList = fileList.concat(getAllFiles(fullPath, extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

// 1. Audit: Zero box-shadow
console.log("Auditing Rule 2: Zero box-shadow...");
const styleFiles = getAllFiles(SRC_DIR, [".css", ".tsx"]);
const shadowViolations: string[] = [];

for (const file of styleFiles) {
  const content = fs.readFileSync(file, "utf-8");
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    // Skip comment lines
    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
      continue;
    }
    if (line.includes("box-shadow") || /\bshadow-(sm|md|lg|xl|2xl|inner|none)\b/.test(line)) {
      shadowViolations.push(`${path.relative(ROOT_DIR, file)}:${i + 1} - ${trimmed}`);
    }
  }
}

results.push({
  title: "Rule 2: Zero box-shadow or Tailwind shadow-* classes",
  passed: shadowViolations.length === 0,
  details: shadowViolations,
});

// 2. Audit: Zero debounced inputs
console.log("Auditing Rule 4: Zero debounced inputs...");
const codeFiles = getAllFiles(SRC_DIR, [".ts", ".tsx"]);
const debounceViolations: string[] = [];

for (const file of codeFiles) {
  const content = fs.readFileSync(file, "utf-8");
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
      continue;
    }
    if (
      line.includes("useDebounce") ||
      /\bdebounce\s*\(/.test(line) ||
      line.includes("lodash.debounce")
    ) {
      debounceViolations.push(`${path.relative(ROOT_DIR, file)}:${i + 1} - ${trimmed}`);
    }
  }
}

results.push({
  title: "Rule 4: Zero debounced inputs (validate on blur/submit)",
  passed: debounceViolations.length === 0,
  details: debounceViolations,
});

// 3. Audit: Zero emojis
console.log("Auditing Rule 3: Zero emojis...");
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
const emojiViolations: string[] = [];

for (const file of codeFiles) {
  const content = fs.readFileSync(file, "utf-8");
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (emojiRegex.test(line)) {
      emojiViolations.push(`${path.relative(ROOT_DIR, file)}:${i + 1} - ${line.trim()}`);
    }
  }
}

results.push({
  title: "Rule 3: Strictly zero emojis across codebase",
  passed: emojiViolations.length === 0,
  details: emojiViolations,
});

// 4. Audit: File line constraints (Max 500 lines per file)
console.log("Auditing Rule 4: Maximum 500 lines per file...");
const allSourceFiles = getAllFiles(SRC_DIR, [".ts", ".tsx", ".css", ".json", ".html"]);
const lineViolations: string[] = [];

for (const file of allSourceFiles) {
  const content = fs.readFileSync(file, "utf-8");
  const lineCount = content.split("\n").length;
  if (lineCount > 500) {
    lineViolations.push(`${path.relative(ROOT_DIR, file)}: ${lineCount} lines (max 500)`);
  }
}

results.push({
  title: "Rule 4: Maximum 500 lines per file",
  passed: lineViolations.length === 0,
  details: lineViolations,
});

// 5. Audit: Folder constraints (Max 3 files per folder)
console.log("Auditing Rule 4: Maximum 3 files per folder in presentation/ and infrastructure/...");
const folderViolations: string[] = [];

function checkFolderLimits(dir: string): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const fileEntries = entries.filter((e) => !e.isDirectory());
  const dirEntries = entries.filter((e) => e.isDirectory());

  if (fileEntries.length > 3) {
    folderViolations.push(
      `${path.relative(ROOT_DIR, dir)}: ${fileEntries.length} files (max 3 allowed per folder)`
    );
  }

  for (const subDir of dirEntries) {
    checkFolderLimits(path.join(dir, subDir.name));
  }
}

checkFolderLimits(path.join(SRC_DIR, "presentation"));
checkFolderLimits(path.join(SRC_DIR, "infrastructure"));

results.push({
  title: "Rule 4: Maximum 3 files per folder in presentation and infrastructure",
  passed: folderViolations.length === 0,
  details: folderViolations,
});

// 6. Audit: Accessibility - images have alt attributes
console.log("Auditing Accessibility: Image alt attributes...");
const tsxFiles = getAllFiles(SRC_DIR, [".tsx"]);
const altViolations: string[] = [];

for (const file of tsxFiles) {
  const content = fs.readFileSync(file, "utf-8");
  // Match <img tags that lack an alt= attribute
  const imgTags = content.match(/<img[^>]*>/g) || [];
  for (const tag of imgTags) {
    if (!tag.includes("alt=")) {
      altViolations.push(`${path.relative(ROOT_DIR, file)}: ${tag}`);
    }
  }
}

results.push({
  title: "Accessibility: All <img> elements have alt attributes",
  passed: altViolations.length === 0,
  details: altViolations,
});

// Summary Report
console.log("\n==========================================");
console.log("       STEP 27 AUDIT GATE REPORT          ");
console.log("==========================================");

let allPassed = true;
for (const res of results) {
  if (res.passed) {
    console.log(`[PASS] ${res.title}`);
  } else {
    allPassed = false;
    console.error(`[FAIL] ${res.title}`);
    if (res.details && res.details.length > 0) {
      for (const d of res.details) {
        console.error(`       • ${d}`);
      }
    }
  }
}

console.log("==========================================");

if (!allPassed) {
  console.error("Step 27 audit gate verification failed.");
  process.exit(1);
}

console.log("🎉 ALL AUDIT GATES PASSED CLEANLY!");

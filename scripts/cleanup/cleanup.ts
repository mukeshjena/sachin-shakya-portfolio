/**
 * scripts/cleanup/cleanup.ts
 * Safe, gated teardown script for Sachin Shakya Portfolio database & media.
 *
 * Safety Gate:
 * Requires explicit CLI flag: `--yes-i-am-sure`
 * Without this flag, the script exits immediately with zero side-effects.
 */

import crypto from "node:crypto";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../../src/infrastructure/firebase/firebaseClient";

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch {
    // Ignore if already loaded
  }
}

const COLLECTIONS_TO_CLEAN = [
  "siteSettings",
  "pages",
  "sections",
  "telemetryMetrics",
  "telemetryCostSeries",
  "telemetryBenchmarks",
  "experience",
  "competencies",
  "certifications",
  "promoPopup",
  "contactSubmissions",
  "mediaAssets",
];

function generateCloudinarySignature(
  params: Record<string, string | number>,
  secret: string
): string {
  const sortedKeys = Object.keys(params).sort();
  const serialized = sortedKeys.map((k) => `${k}=${params[k]}`).join("&");
  return crypto.createHash("sha1").update(`${serialized}${secret}`).digest("hex");
}

async function destroyCloudinaryAsset(
  publicId: string,
  cloudName: string,
  apiKey: string,
  apiSecret: string
): Promise<boolean> {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = generateCloudinarySignature({ public_id: publicId, timestamp }, apiSecret);

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) return false;
  const result = (await response.json()) as { result?: string };
  return result.result === "ok";
}

async function runCleanup(): Promise<void> {
  const args = process.argv.slice(2);
  const isConfirmed = args.includes("--yes-i-am-sure");

  if (!isConfirmed) {
    console.error("==========================================================");
    console.error("SAFETY GATE: Full cleanup was NOT executed.");
    console.error("To wipe all Firestore data and Cloudinary assets, pass:");
    console.error("  npm run cleanup -- --yes-i-am-sure");
    console.error("==========================================================");
    process.exit(1);
  }

  console.log("==========================================================");
  console.log("STARTING FULL TEARDOWN (Firestore Collections + Media Assets)");
  console.log("==========================================================");

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "dq6oxixuf";
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // 1. Clean Cloudinary assets tracked in mediaAssets collection
  if (apiKey && apiSecret) {
    console.log("\nPurging Cloudinary assets under sachin-shakya/...");
    try {
      const mediaSnap = await getDocs(collection(db, "mediaAssets"));
      for (const docSnap of mediaSnap.docs) {
        const publicId = docSnap.data()?.publicId as string | undefined;
        if (publicId?.startsWith("sachin-shakya/")) {
          console.log(`  Deleting Cloudinary asset: ${publicId}...`);
          const destroyed = await destroyCloudinaryAsset(publicId, cloudName, apiKey, apiSecret);
          console.log(`  ${destroyed ? "✓ Deleted" : "! Failed/Skipped"}: ${publicId}`);
        }
      }
    } catch (err) {
      console.warn("  Warning during Cloudinary asset purge:", err);
    }
  }

  // 2. Delete documents from all Firestore collections
  console.log("\nWiping Firestore collections...");
  for (const colName of COLLECTIONS_TO_CLEAN) {
    try {
      const snap = await getDocs(collection(db, colName));
      console.log(`  Purging collection "${colName}" (${snap.docs.length} docs)...`);
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
      console.log(`  ✓ Collection "${colName}" cleared.`);
    } catch (colErr) {
      console.error(`  ✗ Error purging collection "${colName}":`, colErr);
    }
  }

  console.log("\n==========================================================");
  console.log("✓ Teardown complete. All collections and assets removed.");
  console.log("==========================================================");
  process.exit(0);
}

runCleanup();

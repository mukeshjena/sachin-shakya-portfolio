/**
 * Automated Verification Script for Step 08 — Cloudinary Folder Structure & Signed Uploads
 * Tests:
 * 1. Signature generation using Cloudinary SHA-1 algorithm.
 * 2. Signed direct upload to Cloudinary folder "sachin-shakya/test/".
 * 3. Inspection of returned metadata (secure_url, public_id, dimensions, format).
 * 4. Cleanup of the test probe asset via Cloudinary Destroy API.
 */

import crypto from "node:crypto";
import { getEnv } from "../src/infrastructure/system/env";

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch {
    // Ignore if .env is missing or already loaded
  }
}

function generateSignature(params: Record<string, string | number>, secret: string): string {
  const sortedKeys = Object.keys(params).sort();
  const serialized = sortedKeys.map((k) => `${k}=${params[k]}`).join("&");
  return crypto.createHash("sha1").update(`${serialized}${secret}`).digest("hex");
}

async function runCloudinaryVerification(): Promise<void> {
  console.log("==========================================================");
  console.log("Testing Cloudinary Signed Uploads for Sachin Shakya Site");
  console.log("==========================================================");

  const env = getEnv();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || env.cloudinary.cloudName;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary credentials. Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set."
    );
  }

  console.log(`Target Cloud Name: ${cloudName}`);
  console.log(`API Key: ${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`);

  const folder = "sachin-shakya/test";
  const publicId = `test-probe-${Date.now()}`;
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign: Record<string, string | number> = {
    folder,
    public_id: publicId,
    timestamp,
  };

  console.log("Generating SHA-1 upload signature...");
  const signature = generateSignature(paramsToSign, apiSecret);
  console.log(`✓ Signature generated: ${signature.slice(0, 10)}...`);

  // 1x1 transparent PNG data URI
  const testPixel =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  console.log(`Uploading test probe to "${folder}/${publicId}"...`);
  const formData = new FormData();
  formData.append("file", testPixel);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);
  formData.append("public_id", publicId);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    throw new Error(`Upload failed (${uploadResponse.status}): ${errorText}`);
  }

  const uploadResult = (await uploadResponse.json()) as {
    secure_url: string;
    public_id: string;
    folder: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  };

  console.log("✓ Signed upload succeeded!");
  console.log(`  Public ID:   ${uploadResult.public_id}`);
  console.log(`  Folder:      ${uploadResult.folder || folder}`);
  console.log(`  Secure URL:  ${uploadResult.secure_url}`);
  console.log(`  Dimensions:  ${uploadResult.width}x${uploadResult.height}`);
  console.log(`  Format:      ${uploadResult.format}`);
  console.log(`  Size:        ${uploadResult.bytes} bytes`);

  // Verify the asset was placed into the correct root/subfolder
  if (!uploadResult.public_id.startsWith("sachin-shakya/test/")) {
    throw new Error(`Asset not placed in expected folder! Got: ${uploadResult.public_id}`);
  }

  console.log("\nCleaning up test probe from Cloudinary...");
  const destroyTimestamp = Math.round(Date.now() / 1000);
  const destroyParams = {
    public_id: uploadResult.public_id,
    timestamp: destroyTimestamp,
  };
  const destroySignature = generateSignature(destroyParams, apiSecret);

  const destroyFormData = new FormData();
  destroyFormData.append("public_id", uploadResult.public_id);
  destroyFormData.append("api_key", apiKey);
  destroyFormData.append("timestamp", destroyTimestamp.toString());
  destroyFormData.append("signature", destroySignature);

  const destroyUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
  const destroyResponse = await fetch(destroyUrl, {
    method: "POST",
    body: destroyFormData,
  });

  if (!destroyResponse.ok) {
    const destroyError = await destroyResponse.text();
    throw new Error(`Destroy failed (${destroyResponse.status}): ${destroyError}`);
  }

  const destroyResult = (await destroyResponse.json()) as { result: string };
  console.log(`✓ Cleanup successful: result = "${destroyResult.result}"`);

  console.log("==========================================================");
  console.log("Cloudinary signed upload and folder structure verified!");
  console.log("==========================================================");
}

runCloudinaryVerification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("✗ Verification failed:", err);
    process.exit(1);
  });

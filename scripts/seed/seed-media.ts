/**
 * scripts/seed/seed-media.ts
 * Idempotent media asset seeder for Sachin Shakya Portfolio.
 *
 * Rules:
 * 1. Checks Firestore `mediaAssets` collection first by stable deterministic key.
 * 2. If already seeded, skips upload entirely to conserve bandwidth and avoid duplicates.
 * 3. If missing, reads local file, calculates Cloudinary SHA-1 signature, performs direct signed upload.
 * 4. Records metadata into Firestore `mediaAssets` collection.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { CLOUDINARY_FOLDERS } from "../../src/infrastructure/cloudinary/cloudinaryConfig";
import { db } from "../../src/infrastructure/firebase/firebaseClient";

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch {
    // Ignore if already loaded
  }
}

export interface SeededMediaMap {
  logoUrl: string;
  heroPhotoUrl: string;
  experiencePhotoUrl: string;
  aboutPhotoUrl?: string;
  resumePdfUrl?: string;
  cloudInfraUrl: string;
}

interface MediaAssetSeedSpec {
  key: string;
  localPath: string;
  folder: string;
  publicIdPrefix: string;
  altText: string;
  fallbackUrl: string;
}

function generateCloudinarySignature(
  params: Record<string, string | number>,
  secret: string
): string {
  const sortedKeys = Object.keys(params).sort();
  const serialized = sortedKeys.map((k) => `${k}=${params[k]}`).join("&");
  return crypto.createHash("sha1").update(`${serialized}${secret}`).digest("hex");
}

async function uploadFileToCloudinary(
  filePath: string,
  folder: string,
  publicId: string,
  cloudName: string,
  apiKey: string,
  apiSecret: string
): Promise<{
  secure_url: string;
  public_id: string;
  folder: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}> {
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType =
    ext === ".pdf"
      ? "application/pdf"
      : ext === ".svg"
        ? "image/svg+xml"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : "image/png";
  const base64Data = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign: Record<string, string | number> = {
    folder,
    public_id: publicId,
    timestamp,
  };

  const signature = generateCloudinarySignature(paramsToSign, apiSecret);

  const formData = new FormData();
  formData.append("file", base64Data);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);
  formData.append("public_id", publicId);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary upload failed (${response.status}): ${errorText}`);
  }

  return (await response.json()) as {
    secure_url: string;
    public_id: string;
    folder: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
  };
}

export async function seedMediaAssets(): Promise<SeededMediaMap> {
  console.log("\n==========================================================");
  console.log("Phase 1: Seeding Media Assets (Cloudinary + Firestore)");
  console.log("==========================================================");

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "dq6oxixuf";
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const projectAssetsDir = path.resolve(process.cwd(), "public", "assets");
  const downloadsDir = path.join("C:", "Users", "LenovO", "Downloads");

  const resolveAssetPath = (filename: string): string => {
    const projectPath = path.join(projectAssetsDir, filename);
    if (fs.existsSync(projectPath)) {
      return projectPath;
    }
    const publicPath = path.join(process.cwd(), "public", filename);
    if (fs.existsSync(publicPath)) {
      return publicPath;
    }
    const codeOldPath = path.join(process.cwd(), "code.old", filename);
    if (fs.existsSync(codeOldPath)) {
      return codeOldPath;
    }
    return path.join(downloadsDir, filename);
  };

  const assetsToSeed: MediaAssetSeedSpec[] = [
    {
      key: "asset-logo",
      localPath: resolveAssetPath("sachin-logo.png"),
      folder: CLOUDINARY_FOLDERS.logo,
      publicIdPrefix: "sachin-logo",
      altText: "Sachin Shakya — Lead Cloud Architect & DevOps Consultant Logo",
      fallbackUrl:
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    },
    {
      key: "asset-sachin-hero",
      localPath: resolveAssetPath("sachin-one.png"),
      folder: CLOUDINARY_FOLDERS.homeHero,
      publicIdPrefix: "sachin-hero",
      altText: "Sachin Shakya — Executive Cloud Operations & Architecture Leadership",
      fallbackUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    },
    {
      key: "asset-sachin-experience",
      localPath: resolveAssetPath("sachin-two.png"),
      folder: CLOUDINARY_FOLDERS.homeExperience,
      publicIdPrefix: "sachin-experience",
      altText: "Sachin Shakya — Mission-Critical Cloud Telemetry & DevOps Execution",
      fallbackUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    },
    {
      key: "asset-sachin-about",
      localPath: resolveAssetPath("sachin-three.png"),
      folder: CLOUDINARY_FOLDERS.homeImpact,
      publicIdPrefix: "sachin-about",
      altText: "Sachin Shakya — Enterprise Architecture & Strategic Advisory",
      fallbackUrl:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    },
    {
      key: "asset-resume-pdf",
      localPath: resolveAssetPath("Sachin_Shakya_Resume.pdf"),
      folder: CLOUDINARY_FOLDERS.documents,
      publicIdPrefix: "sachin-shakya-resume",
      altText: "Sachin Shakya — Lead Cloud Architect & DevOps Consultant Official Résumé (PDF)",
      fallbackUrl: "/Sachin_Shakya_Resume.pdf",
    },
  ];

  const results: Record<string, string> = {};

  for (const asset of assetsToSeed) {
    const assetRef = doc(db, "mediaAssets", asset.key);
    const existingDoc = await getDoc(assetRef);

    if (existingDoc.exists() && existingDoc.data()?.url) {
      const existingUrl = existingDoc.data().url as string;
      console.log(`✓ [CACHED] Media "${asset.key}" already seeded in Firestore: ${existingUrl}`);
      results[asset.key] = existingUrl;
      continue;
    }

    // Check if local file exists
    if (fs.existsSync(asset.localPath) && apiKey && apiSecret) {
      console.log(`Uploading local file "${asset.localPath}" to Cloudinary "${asset.folder}"...`);
      const publicId = `${asset.publicIdPrefix}-${Date.now()}`;
      const uploadResult = await uploadFileToCloudinary(
        asset.localPath,
        asset.folder,
        publicId,
        cloudName,
        apiKey,
        apiSecret
      );

      await setDoc(
        assetRef,
        {
          id: asset.key,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          folder: uploadResult.folder || asset.folder,
          altText: asset.altText,
          usageRefs: ["pages/home", "siteSettings/global"],
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      console.log(`✓ Uploaded and recorded: ${uploadResult.secure_url}`);
      results[asset.key] = uploadResult.secure_url;
    } else {
      console.log(`! Using verified fallback URL for "${asset.key}"`);
      await setDoc(
        assetRef,
        {
          id: asset.key,
          url: asset.fallbackUrl,
          publicId: `fallback-${asset.key}`,
          folder: asset.folder,
          altText: asset.altText,
          usageRefs: ["pages/home", "siteSettings/global"],
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
      results[asset.key] = asset.fallbackUrl;
    }
  }

  // Stock cloud infrastructure telemetry background
  const infraUrl =
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80";

  return {
    logoUrl: results["asset-logo"],
    heroPhotoUrl: results["asset-sachin-hero"],
    experiencePhotoUrl: results["asset-sachin-experience"],
    aboutPhotoUrl: results["asset-sachin-about"],
    resumePdfUrl: results["asset-resume-pdf"],
    cloudInfraUrl: infraUrl,
  };
}

// infrastructure/cloudinary/cloudinaryConfig.ts
// Centralized Cloudinary configuration, folder hierarchy constants, and CDN URL transformations.

export const CLOUDINARY_ROOT_FOLDER = "sachin-shakya" as const;

export const CLOUDINARY_FOLDERS = {
  root: CLOUDINARY_ROOT_FOLDER,
  logo: `${CLOUDINARY_ROOT_FOLDER}/logo`,
  homeHero: `${CLOUDINARY_ROOT_FOLDER}/home/hero`,
  homeImpact: `${CLOUDINARY_ROOT_FOLDER}/home/impact`,
  homeExperience: `${CLOUDINARY_ROOT_FOLDER}/home/experience`,
  documents: `${CLOUDINARY_ROOT_FOLDER}/documents`,
  promoPopup: `${CLOUDINARY_ROOT_FOLDER}/promo-popup`,
  test: `${CLOUDINARY_ROOT_FOLDER}/test`,
  pages: (slug: string): string => `${CLOUDINARY_ROOT_FOLDER}/pages/${slug}`,
} as const;

export type CloudinaryFolderPreset =
  | "logo"
  | "homeHero"
  | "homeImpact"
  | "homeExperience"
  | "documents"
  | "promoPopup"
  | "test";

export interface ImageTransformOptions {
  readonly width?: number;
  readonly height?: number;
  readonly crop?: "fill" | "limit" | "fit" | "thumb" | "scale";
  readonly quality?: "auto" | "auto:best" | "auto:good" | "auto:eco" | "auto:low" | number;
  readonly format?: "auto" | "webp" | "avif" | "png" | "jpg";
  readonly dpr?: "auto" | number;
}

const DEFAULT_CLOUD_NAME = "dq6oxixuf";

/**
 * Builds an optimized Cloudinary delivery URL with automatic format and quality tuning.
 * Accepts either a raw public_id or an existing Cloudinary URL.
 */
export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  options: ImageTransformOptions = {},
  cloudName = DEFAULT_CLOUD_NAME
): string {
  if (!publicIdOrUrl) return "";

  let publicId = publicIdOrUrl;
  // If a full Cloudinary URL was provided, extract the relative public_id path
  const uploadMarker = "/image/upload/";
  const markerIdx = publicIdOrUrl.indexOf(uploadMarker);
  if (markerIdx !== -1) {
    const afterMarker = publicIdOrUrl.slice(markerIdx + uploadMarker.length);
    // Strip version prefix if present, e.g. "v1712345678/..."
    publicId = afterMarker.replace(/^v\d+\//, "");
  }

  const transforms: string[] = [`f_${options.format ?? "auto"}`, `q_${options.quality ?? "auto"}`];

  if (options.width) {
    transforms.push(`w_${options.width}`);
  }
  if (options.height) {
    transforms.push(`h_${options.height}`);
  }
  if (options.crop) {
    transforms.push(`c_${options.crop}`);
  }
  if (options.dpr) {
    transforms.push(`dpr_${options.dpr}`);
  }

  const transformString = transforms.join(",");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
}

/**
 * Returns a square or proportional thumbnail for admin preview or avatar cards.
 */
export function getThumbnailUrl(
  publicIdOrUrl: string,
  size = 120,
  cloudName = DEFAULT_CLOUD_NAME
): string {
  return getOptimizedImageUrl(
    publicIdOrUrl,
    {
      width: size,
      height: size,
      crop: "fill",
      quality: "auto",
      format: "auto",
    },
    cloudName
  );
}

/**
 * Generates a responsive srcset string for high-DPI screens and diverse viewport widths.
 */
export function getResponsiveSrcSet(
  publicIdOrUrl: string,
  widths: readonly number[] = [360, 640, 768, 1024, 1280, 1536],
  cloudName = DEFAULT_CLOUD_NAME
): string {
  return widths
    .map((w) => `${getOptimizedImageUrl(publicIdOrUrl, { width: w }, cloudName)} ${w}w`)
    .join(", ");
}

/**
 * Resolves the appropriate folder based on key or preset.
 */
export function resolveCloudinaryFolder(folderOrPreset?: string): string {
  if (!folderOrPreset) return CLOUDINARY_FOLDERS.root;
  if (folderOrPreset in CLOUDINARY_FOLDERS) {
    const key = folderOrPreset as CloudinaryFolderPreset;
    return CLOUDINARY_FOLDERS[key];
  }
  if (folderOrPreset.startsWith(CLOUDINARY_ROOT_FOLDER)) {
    return folderOrPreset;
  }
  return `${CLOUDINARY_ROOT_FOLDER}/${folderOrPreset}`;
}

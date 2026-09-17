// domain/entities/content/MediaAsset.ts
// Pure domain entity — zero framework imports allowed in this file.

/**
 * A media file stored in Cloudinary under the sachin-shakya/ root folder.
 * Every asset is tracked here so the admin can see what exists and the
 * cascade-delete logic (Step 24) can clean up Cloudinary when content is removed.
 */
export interface MediaAsset {
  /** Firestore document ID (also used as the stable dedup key in seed scripts) */
  id: string;
  /** Cloudinary secure_url — the public CDN URL used in <img> tags */
  url: string;
  /** Cloudinary public_id — required for Admin API delete calls */
  publicId: string;
  /** Cloudinary folder path, e.g. "sachin-shakya/home/hero" */
  folder: string;
  /** Accessible alt text for screen readers — must be set on every asset */
  altText: string;
  /**
   * List of Firestore document paths that reference this asset
   * (e.g. "pages/home", "siteSettings/logo").
   * Used for cascade-delete: if usageRefs is empty, the asset is orphaned
   * and can be safely removed from Cloudinary.
   */
  usageRefs: string[];
  /** Original pixel dimensions */
  width?: number;
  height?: number;
  /** File format as returned by Cloudinary (e.g. "png", "jpg", "pdf") */
  format?: string;
  /** File size in bytes */
  bytes?: number;
  createdAt: Date;
}

export type CreateMediaAssetInput = Omit<MediaAsset, "id" | "createdAt">;

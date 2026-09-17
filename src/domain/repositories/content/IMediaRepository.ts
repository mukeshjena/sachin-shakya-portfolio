// domain/repositories/content/IMediaRepository.ts
// Interface only — zero framework or infrastructure imports.

import type { CreateMediaAssetInput, MediaAsset } from "../../entities/content/MediaAsset";

/**
 * Contract for media asset persistence.
 * Tracks Cloudinary assets in Firestore so the admin UI can list, preview,
 * and cascade-delete media without hitting the Cloudinary Admin API directly.
 *
 * Implemented by CloudinaryMediaRepository in the infrastructure layer.
 */
export interface IMediaRepository {
  /** Returns all tracked media assets */
  getAll(): Promise<MediaAsset[]>;

  /** Fetches a single asset by Firestore document ID — null if not found */
  getById(id: string): Promise<MediaAsset | null>;

  /** Finds an asset by its Cloudinary public_id (used for dedup in seed script) */
  getByPublicId(publicId: string): Promise<MediaAsset | null>;

  /** Creates a Firestore record for a newly-uploaded Cloudinary asset */
  save(input: CreateMediaAssetInput): Promise<MediaAsset>;

  /** Removes the Firestore record (does NOT delete from Cloudinary — call separately) */
  delete(id: string): Promise<void>;

  /**
   * Adds a Firestore document path to usageRefs.
   * Called whenever a new field in a document starts referencing this asset.
   */
  addUsageRef(id: string, ref: string): Promise<void>;

  /**
   * Removes a Firestore document path from usageRefs.
   * When usageRefs drops to zero, the asset is considered orphaned.
   */
  removeUsageRef(id: string, ref: string): Promise<void>;
}

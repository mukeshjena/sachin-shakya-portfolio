// infrastructure/cloudinary/CloudinaryMediaUploader.ts
// Concrete implementation of IMediaUploader backed by Cloudinary edge-signed uploads.

import type {
  IMediaUploader,
  UploadMediaInput,
  UploadMediaOutput,
} from "../../domain/services/IMediaUploader";
import { destroyFromCloudinary, uploadToCloudinary } from "./cloudinaryClient";
import { resolveCloudinaryFolder } from "./cloudinaryConfig";

export class CloudinaryMediaUploader implements IMediaUploader {
  /**
   * Uploads an asset directly to Cloudinary using an edge-issued short-lived signature.
   */
  async upload(input: UploadMediaInput): Promise<UploadMediaOutput> {
    const targetFolder = resolveCloudinaryFolder(input.folder);

    const response = await uploadToCloudinary(input.file, {
      folder: targetFolder,
      publicId: input.publicId,
      tags: input.tags,
    });

    return {
      publicId: response.public_id,
      url: response.secure_url,
      folder: response.folder || targetFolder,
      width: response.width,
      height: response.height,
      format: response.format,
      bytes: response.bytes,
    };
  }

  /**
   * Destroys an asset in Cloudinary through the Edge Worker proxy.
   */
  async destroy(publicId: string): Promise<boolean> {
    return await destroyFromCloudinary(publicId);
  }
}

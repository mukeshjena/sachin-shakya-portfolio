// application/use-cases/media/UploadMediaUseCase.ts
// Use-case for uploading media files to Cloudinary and registering tracking metadata in Firestore.
// Clean Architecture: zero UI framework dependencies.

import type { MediaAsset } from "../../../domain/entities/content/MediaAsset";
import type { IMediaRepository } from "../../../domain/repositories/content/IMediaRepository";
import type { IMediaUploader } from "../../../domain/services/IMediaUploader";

export interface UploadMediaInput {
  readonly file: File | Blob | string;
  readonly altText: string;
  readonly folder?: string;
  readonly usageRef?: string;
  readonly publicId?: string;
  readonly tags?: readonly string[];
}

export interface IUploadMediaUseCase {
  execute(input: UploadMediaInput): Promise<MediaAsset>;
}

export class UploadMediaUseCase implements IUploadMediaUseCase {
  private readonly mediaUploader: IMediaUploader;
  private readonly mediaRepository: IMediaRepository;

  constructor(mediaUploader: IMediaUploader, mediaRepository: IMediaRepository) {
    this.mediaUploader = mediaUploader;
    this.mediaRepository = mediaRepository;
  }

  async execute(input: UploadMediaInput): Promise<MediaAsset> {
    if (!input.file) {
      throw new Error("A valid file or data URI must be provided for upload.");
    }

    const trimmedAlt = input.altText?.trim() || "Sachin Shakya Portfolio Media Asset";

    // 1. Upload via secure Edge Worker signature to Cloudinary
    const uploadResult = await this.mediaUploader.upload({
      file: input.file,
      folder: input.folder,
      publicId: input.publicId,
      tags: input.tags,
    });

    // 2. Persist media tracking document in Firestore
    const asset = await this.mediaRepository.save({
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      folder: uploadResult.folder,
      altText: trimmedAlt,
      usageRefs: input.usageRef ? [input.usageRef] : [],
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
    });

    return asset;
  }
}

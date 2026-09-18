// application/use-cases/media/DeleteMediaUseCase.ts
// Use-case for cascade-deleting media assets from both Cloudinary and Firestore.
// Clean Architecture: zero UI framework dependencies.

import type { IMediaRepository } from "../../../domain/repositories/content/IMediaRepository";
import type { IMediaUploader } from "../../../domain/services/IMediaUploader";

export interface DeleteMediaInput {
  readonly id?: string;
  readonly publicId?: string;
  readonly force?: boolean;
}

export interface IDeleteMediaUseCase {
  execute(input: DeleteMediaInput): Promise<void>;
}

export class DeleteMediaUseCase implements IDeleteMediaUseCase {
  private readonly mediaUploader: IMediaUploader;
  private readonly mediaRepository: IMediaRepository;

  constructor(mediaUploader: IMediaUploader, mediaRepository: IMediaRepository) {
    this.mediaUploader = mediaUploader;
    this.mediaRepository = mediaRepository;
  }

  async execute(input: DeleteMediaInput): Promise<void> {
    let targetId = input.id;
    let targetPublicId = input.publicId;

    if (!targetId && !targetPublicId) {
      throw new Error("Either an asset ID or public_id must be provided for deletion.");
    }

    // Lookup asset if only one identifier is provided
    if (targetId && !targetPublicId) {
      const asset = await this.mediaRepository.getById(targetId);
      if (asset) {
        targetPublicId = asset.publicId;
      }
    } else if (targetPublicId && !targetId) {
      const asset = await this.mediaRepository.getByPublicId(targetPublicId);
      if (asset) {
        targetId = asset.id;
      }
    }

    // 1. Destroy asset from Cloudinary via edge worker proxy
    if (targetPublicId) {
      try {
        await this.mediaUploader.destroy(targetPublicId);
      } catch (err) {
        console.warn(
          `[DeleteMediaUseCase] Failed to delete from Cloudinary: ${targetPublicId}`,
          err
        );
      }
    }

    // 2. Remove tracking document from Firestore
    if (targetId) {
      await this.mediaRepository.delete(targetId);
    }
  }
}

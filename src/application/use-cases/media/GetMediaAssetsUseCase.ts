// application/use-cases/media/GetMediaAssetsUseCase.ts
// Use-case for querying all tracked media assets from Firestore.
// Clean Architecture: zero UI framework dependencies.

import type { MediaAsset } from "../../../domain/entities/content/MediaAsset";
import type { IMediaRepository } from "../../../domain/repositories/content/IMediaRepository";

export interface IGetMediaAssetsUseCase {
  execute(): Promise<MediaAsset[]>;
}

export class GetMediaAssetsUseCase implements IGetMediaAssetsUseCase {
  private readonly mediaRepository: IMediaRepository;

  constructor(mediaRepository: IMediaRepository) {
    this.mediaRepository = mediaRepository;
  }

  async execute(): Promise<MediaAsset[]> {
    return await this.mediaRepository.getAll();
  }
}

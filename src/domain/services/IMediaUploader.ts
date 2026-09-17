// domain/services/IMediaUploader.ts
// Pure domain interface for cloud media asset upload and deletion.
// Zero framework or external vendor dependencies.

export interface UploadMediaInput {
  /** File content: File/Blob in browser, or base64 data URI string */
  readonly file: File | Blob | string;
  /** Destination folder under root, e.g. "sachin-shakya/home/hero" */
  readonly folder?: string;
  /** Optional custom public_id */
  readonly publicId?: string;
  /** Optional comma-separated or array of tags */
  readonly tags?: readonly string[];
}

export interface UploadMediaOutput {
  readonly publicId: string;
  readonly url: string;
  readonly folder: string;
  readonly width?: number;
  readonly height?: number;
  readonly format?: string;
  readonly bytes?: number;
}

export interface IMediaUploader {
  /** Uploads a file using signed credentials and returns the persistent asset metadata */
  upload(input: UploadMediaInput): Promise<UploadMediaOutput>;

  /** Deletes an asset by its public_id */
  destroy(publicId: string): Promise<boolean>;
}

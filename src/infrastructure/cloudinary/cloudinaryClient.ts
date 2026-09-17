// infrastructure/cloudinary/cloudinaryClient.ts
// Client-side signed upload client that coordinates with the Cloudflare Edge Worker gateway.
// Zero secrets exposed to the browser bundle.

export interface CloudinarySignaturePayload {
  readonly signature: string;
  readonly timestamp: number;
  readonly apiKey: string;
  readonly cloudName: string;
  readonly folder: string;
  readonly public_id?: string;
}

export interface CloudinaryRawUploadResponse {
  readonly public_id: string;
  readonly secure_url: string;
  readonly folder?: string;
  readonly width?: number;
  readonly height?: number;
  readonly format?: string;
  readonly bytes?: number;
}

export interface SignRequestOptions {
  readonly folder?: string;
  readonly publicId?: string;
  readonly tags?: readonly string[];
}

/**
 * Requests an edge-signed authorization payload from the Cloudflare Worker.
 */
export async function fetchUploadSignature(
  options: SignRequestOptions = {}
): Promise<CloudinarySignaturePayload> {
  const response = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-requested-with": "XMLHttpRequest",
    },
    body: JSON.stringify({
      folder: options.folder,
      public_id: options.publicId,
      tags: options.tags ? options.tags.join(",") : undefined,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to obtain upload signature (${response.status}): ${errorText}`);
  }

  return (await response.json()) as CloudinarySignaturePayload;
}

/**
 * Uploads a file directly to Cloudinary using an edge-issued short-lived signature.
 */
export async function uploadToCloudinary(
  file: File | Blob | string,
  options: SignRequestOptions = {}
): Promise<CloudinaryRawUploadResponse> {
  const signData = await fetchUploadSignature(options);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signData.apiKey);
  formData.append("timestamp", signData.timestamp.toString());
  formData.append("signature", signData.signature);
  formData.append("folder", signData.folder);

  if (signData.public_id) {
    formData.append("public_id", signData.public_id);
  }

  if (options.tags && options.tags.length > 0) {
    formData.append("tags", options.tags.join(","));
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;
  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    const errBody = await uploadResponse.text();
    throw new Error(`Cloudinary upload failed (${uploadResponse.status}): ${errBody}`);
  }

  return (await uploadResponse.json()) as CloudinaryRawUploadResponse;
}

/**
 * Requests server-side deletion of an asset via the Edge Worker gateway.
 */
export async function destroyFromCloudinary(publicId: string): Promise<boolean> {
  const response = await fetch("/api/cloudinary/destroy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-requested-with": "XMLHttpRequest",
    },
    body: JSON.stringify({ public_id: publicId }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to destroy asset (${response.status}): ${errText}`);
  }

  const result = (await response.json()) as { result?: string };
  return result.result === "ok";
}

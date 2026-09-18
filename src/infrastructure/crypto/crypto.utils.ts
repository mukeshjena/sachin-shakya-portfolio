// infrastructure/crypto/crypto.utils.ts
// Pure cryptographic utility computing deterministic SHA-256 hashes.
// Uses native Web Crypto API (supported across Cloudflare Workers, modern browsers, and Node.js).

/**
 * Computes a lowercase hex SHA-256 hash of a string.
 */
export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

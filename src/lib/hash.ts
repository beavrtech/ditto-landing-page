/**
 * SHA-256 hex digest of a string via the Web Crypto API.
 *
 * Used to derive a stable, non-reversible PostHog distinct_id from an email
 * (the raw email is kept as a person property, not the ID). Runs in the
 * browser / edge runtime where `crypto.subtle` is available.
 */
export async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generate key for the JWT
 *
 * @documentation https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey
 */

// Generate key
const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"]
);

// Export Key
export const exportKeyJWT = await crypto.subtle.exportKey("jwk", key);

// Export function to get key
export function importPrivateKey(jwk: JsonWebKey) {
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
  );
}

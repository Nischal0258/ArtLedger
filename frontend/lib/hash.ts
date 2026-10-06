/**
 * Computes a standard SHA-256 cryptographic digest of a File in the browser using the Web Crypto API.
 * Returns an Ethereum-compatible bytes32 hex string prefixed with 0x.
 */
export async function computeSHA256(file: File): Promise<`0x${string}`> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `0x${hashHex}` as `0x${string}`;
}

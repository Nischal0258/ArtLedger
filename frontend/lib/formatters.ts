/**
 * Truncate an Ethereum address (e.g. 0x1234...5678)
 */
export function truncateAddress(address?: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Truncate a hash or IPFS CID
 */
export function truncateHash(hash?: string, chars = 6): string {
  if (!hash) return "";
  if (hash.length <= chars * 2) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

/**
 * Convert block timestamp to relative time (e.g. "2 hours ago")
 */
export function formatRelativeTime(timestamp: number | bigint): string {
  const ts = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  const now = Math.floor(Date.now() / 1000);
  const diff = now - ts;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(ts * 1000).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Convert block timestamp to full date string
 */
export function formatFullDate(timestamp: number | bigint): string {
  const ts = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  return new Date(ts * 1000).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * Resolve IPFS URI or CID to a public gateway URL
 */
export function resolveIPFSUrl(uriOrCid: string, gateway = "https://gateway.pinata.cloud/ipfs/"): string {
  if (!uriOrCid) return "/placeholder-art.jpg";
  if (uriOrCid.startsWith("http://") || uriOrCid.startsWith("https://")) {
    return uriOrCid;
  }
  const cleanCid = uriOrCid.replace(/^ipfs:\/\//, "");
  const cleanGateway = gateway.endsWith("/") ? gateway : `${gateway}/`;
  return `${cleanGateway}${cleanCid}`;
}

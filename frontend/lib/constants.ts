// Role hashes matching Solidity keccak256 strings
export const ROLES = {
  DEFAULT_ADMIN: "0x0000000000000000000000000000000000000000000000000000000000000000" as const,
  ARTIST: "0x877a788de359d576de326493d41154baed249499e335942463b0a16f7a38c434" as const,
  GALLERY: "0x604f378fe87ee26176378eecde8bcf9a22d4f29ee4a4604e38fb710eec5e62b4" as const,
  RESTORER: "0xbce2753a3db4b66b4478170c0c6e949ffcd3b137f61e8996b26d11a774db37a1" as const,
  APPRAISER: "0xd9f6a27bb46c3ef6cc676f23b7e7161bca85959828d1dd0cf779fdfa74d75d65" as const,
};

export const ROLE_METADATA: Record<string, { name: string; color: string; badgeClass: string; icon: string }> = {
  [ROLES.DEFAULT_ADMIN]: {
    name: "Admin",
    color: "amber",
    badgeClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    icon: "ShieldAlert",
  },
  [ROLES.ARTIST]: {
    name: "Artist",
    color: "purple",
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: "Palette",
  },
  [ROLES.GALLERY]: {
    name: "Gallery",
    color: "blue",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: "Landmark",
  },
  [ROLES.RESTORER]: {
    name: "Restorer",
    color: "emerald",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: "Sparkles",
  },
  [ROLES.APPRAISER]: {
    name: "Appraiser",
    color: "amber",
    badgeClass: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    icon: "BadgeCheck",
  },
};

export enum EventType {
  Minted = 0,
  CustodyTransfer = 1,
  Exhibition = 2,
  Restoration = 3,
  Appraisal = 4,
  StorageUpdate = 5,
}

export const EVENT_METADATA: Record<EventType, { title: string; color: string; icon: string; description: string }> = {
  [EventType.Minted]: {
    title: "Artwork Minted",
    color: "purple",
    icon: "Sparkles",
    description: "Initial cryptographic minting and registration on ArtLedger",
  },
  [EventType.CustodyTransfer]: {
    title: "Custody Transfer",
    color: "blue",
    icon: "ArrowRightLeft",
    description: "Ownership or physical custody transferred to a new party",
  },
  [EventType.Exhibition]: {
    title: "Exhibition Loan",
    color: "emerald",
    icon: "Landmark",
    description: "Artwork put on display at an authorized exhibition or museum",
  },
  [EventType.Restoration]: {
    title: "Restoration Work",
    color: "amber",
    icon: "Hammer",
    description: "Conservation, conditioning report, or structural preservation",
  },
  [EventType.Appraisal]: {
    title: "Official Appraisal",
    color: "rose",
    icon: "BadgeDollarSign",
    description: "Independent market valuation and authenticity certification",
  },
  [EventType.StorageUpdate]: {
    title: "Storage Relocation",
    color: "slate",
    icon: "Box",
    description: "Transferred to a climate-controlled vault or warehouse",
  },
};

export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
export const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs/";

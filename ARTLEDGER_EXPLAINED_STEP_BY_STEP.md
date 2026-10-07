# 🏛️ ArtLedger — The Complete Project & Blockchain Guide

> **A Comprehensive, Shareable Technical Guide for Team Members, Mentors, and Hackathon Judges**  
> *Project: ArtLedger (Decentralized Fine Art Provenance & Custody Protocol)*

---

## 📌 Executive Summary: What Problem Are We Solving?

In the traditional \$65 Billion global art market:
1. **Pervasive Forgery**: The Fine Art Expert Institute estimates that **over 50% of artworks** circulating in the secondary market are either forged, misattributed, or lack authentic provenance.
2. **Paper Fragility**: Certificates of Authenticity (COAs) are physical paper slips easily duplicated, water-damaged, stolen, or fabricated by crooked dealers.
3. **Siloed Trust**: Auction houses (Sotheby's, Christie's), restoration labs, and galleries keep private, conflicting records. If an archive is altered or lost, the artwork's historical chain of custody is broken.

### The ArtLedger Solution:
ArtLedger binds **physical and digital masterpieces** to the **Ethereum blockchain** through two foundational innovations:
- **Cryptographic Dual-Binding**: Storing client-computed SHA-256 media fingerprints on-chain paired with decentralized IPFS media files.
- **Institutional Role-Segregated Provenance**: An append-only, tamper-evident timeline where only verified Artists, Galleries, Restorers, and Appraisers can sign off on life events.

---

## 🔍 Part 1: How the App Works Step-by-Step

Here is the exact journey from blank canvas to museum exhibition and instant verification:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ARTLEDGER LIFECYCLE FLOW                        │
└────────────────────────────────────────────────────────────────────────┘

  [ 1. Genesis Registration ]
         │
         ├── Artist uploads high-res artwork image
         ├── Browser calculates SHA-256 digest (Web Crypto API)
         ├── Media & metadata pinned to IPFS (via Pinata)
         └── Smart contract executes mintArtwork() ──► Issues ERC-721 Token #ID
                                                   └── Seeds Genesis Event #0
         │
  [ 2. Institutional Life Cycle ]
         │
         ├── Gallery logs exhibition loan (GALLERY_ROLE)
         ├── Restorer logs varnish scan & condition report (RESTORER_ROLE)
         └── Appraiser logs certified $450M insurance valuation (APPRAISER_ROLE)
         │
  [ 3. Physical Dual-Binding ]
         │
         └── Physical frame receives cryptographic QR Placard linking to Token #ID
         │
  [ 4. Zero-Trust Verification (/verify) ]
         │
         ├── Collector / Museum scans QR code or enters Token #ID
         ├── Uploads suspect or physical photograph
         ├── Browser computes SHA-256 fingerprint in real-time
         └── Smart contract calls verifyImageHash()
                 ├── MATCH    ──► Verified Authentic Original (Green)
                 └── MISMATCH ──► Counterfeit / Forgery Detected (Red)
```

### Step 1: Artwork Creation (`/mint`)
1. An authorized creator (with `ARTIST_ROLE`) accesses the registration studio.
2. The user drops in the master image file.
3. Before anything is sent over the wire, the browser runs `crypto.subtle.digest("SHA-256", arrayBuffer)` producing a 32-byte hex string (e.g., `0x8f3c...`).
4. The media is pinned to IPFS via Pinata, producing a decentralized Content Identifier (CID).
5. The artist submits the transaction to the EVM contract. An ERC-721 token is minted directly to their address, with the `imageHash` permanently bound into storage.

### Step 2: Multi-Institutional Custody Updates (`/artwork/[id]`)
1. Once minted, an artwork enters the world. It gets loaned, restored, and insured.
2. ArtLedger provides a **Role Action Panel**:
   - When **Galerie Louvre** logs an exhibition loan, they sign a transaction using their verified gallery key.
   - When **Dr. Julian Croft (Conservator)** performs infrared reflectography, he logs the conservation entry under `RESTORER_ROLE`.
   - When **Sotheby's** appraises the work, they log the valuation under `APPRAISER_ROLE`.
3. If an unauthorized random address attempts to call `logCustodyEvent`, the EVM instantly reverts the transaction.

### Step 3: Physical-Digital Dual Binding (The Frame Placard)
1. In the physical gallery or museum, every artwork has a wall label or certificate placard.
2. ArtLedger generates a **tamper-evident QR code** linking directly to the token's on-chain record.
3. Observers and buyers can scan the QR code to view the live, decentralized history.

### Step 4: Instant Public Verification (`/verify`)
1. Anyone holding a digital file or receiving the physical painting can navigate to `/verify`.
2. They select the Token ID and drop in their copy of the image.
3. The app computes the SHA-256 hash client-side and queries `artLedger.verifyImageHash(tokenId, candidateHash)`.
4. Because hashing is deterministic and exhibits the **avalanche effect**, modifying even a single pixel or compression artifact creates an entirely different hash, exposing counterfeits in milliseconds.

---

## ⛓️ Part 2: How the Blockchain Works Under the Hood

The smart contract [`ArtLedger.sol`](file:///c:/Users/Dell/Desktop/All-Projects/ArtLedger/blockchain/contracts/ArtLedger.sol) is written in Solidity `^0.8.24` and compiled using Hardhat.

### 1. Smart Contract Architecture & Inheritance
```solidity
contract ArtLedger is ERC721URIStorage, AccessControl, ReentrancyGuard
```
- **`ERC721URIStorage`**: Implements standard Ethereum token interfaces (`ownerOf`, `transferFrom`, `tokenURI`) so artworks can live in Web3 wallets and market protocols.
- **`AccessControl`**: Provides role-based permissioning using 32-byte hash identifiers rather than a single owner.
- **`ReentrancyGuard`**: Protects all state-modifying functions from reentrancy attacks.

### 2. Cryptographic Role Segregation (RBAC)
Instead of arbitrary accounts or a single admin writing to history, roles are defined via `keccak256`:
```solidity
bytes32 public constant ARTIST_ROLE    = keccak256("ARTIST_ROLE");
bytes32 public constant GALLERY_ROLE   = keccak256("GALLERY_ROLE");
bytes32 public constant RESTORER_ROLE  = keccak256("RESTORER_ROLE");
bytes32 public constant APPRAISER_ROLE = keccak256("APPRAISER_ROLE");
```
When someone attempts to log an event:
```solidity
function resolveCallerRole(address account) public view returns (bytes32) {
    if (hasRole(DEFAULT_ADMIN_ROLE, account)) return DEFAULT_ADMIN_ROLE;
    if (hasRole(ARTIST_ROLE, account))        return ARTIST_ROLE;
    if (hasRole(GALLERY_ROLE, account))       return GALLERY_ROLE;
    if (hasRole(RESTORER_ROLE, account))      return RESTORER_ROLE;
    if (hasRole(APPRAISER_ROLE, account))     return APPRAISER_ROLE;
    return bytes32(0);
}
```
If `resolveCallerRole(msg.sender)` returns zero, the smart contract emits `UnauthorizedAttempt` and throws:
`revert("Caller lacks an authorized role");`

### 3. On-Chain Data Structures
```solidity
struct Artwork {
    string  artistName;
    string  title;
    uint16  year;
    string  medium;
    bytes32 imageHash;     // 32-byte SHA-256 fingerprint
    string  ipfsCID;       // Decentralized storage identifier
    uint256 mintedAt;      // Block timestamp
    address mintedBy;      // Minting artist address
}

struct CustodyEvent {
    EventType eventType;   // Minted, CustodyTransfer, Exhibition, Restoration, Appraisal, StorageUpdate
    address   actor;       // Curator or institution performing the action
    bytes32   actorRole;   // Role claimed by the actor
    uint256   timestamp;   // Block timestamp
    string    description; // Descriptive notes or report summary
    string    location;    // Physical facility, city, or museum
}
```
State mappings:
```solidity
mapping(uint256 => Artwork) private _artworks;
mapping(uint256 => CustodyEvent[]) private _provenanceLog;
```

### 4. Gas Optimization & Scalability
- **Why not store the whole image on-chain?** Storing a 20MB image in Ethereum storage would cost thousands of dollars in gas fees. By storing the **32-byte SHA-256 digest**, gas consumption for minting is minimal ($O(1)$ storage cost) while guaranteeing mathematical authenticity.
- **Why decentralized IPFS?** IPFS stores the actual content addressed by its cryptographic CID, preventing link rot or server shutdowns.

---

## 💻 Part 3: Technology Stack

- **Smart Contracts**: Solidity `^0.8.24`, Hardhat, OpenZeppelin Contracts v5.
- **Frontend Framework**: Next.js 14 (App Router), React, TypeScript.
- **Styling & Components**: Tailwind CSS, Lucide Icons, Sonner Toasts, Canvas-Confetti.
- **Web3 Integration**: Wagmi v2, Viem, RainbowKit.
- **Decentralized Storage**: Pinata Cloud IPFS gateway.
- **Virtual Demo Engine**: Built-in 5-persona instant wallet switcher (`demoWallet.tsx`) simulating Admin, Gallery, Restorer, Appraiser, and Artist.
- **Testing**: 10 automated Hardhat unit tests covering AccessControl, minting, event logging, and cryptographic verification with 100% pass rate.

---

## 🎯 Part 4: Frequently Asked Questions for Pitches & Judges

### Q1: What makes ArtLedger different from regular NFT projects on OpenSea?
> **Answer**: Regular NFTs represent speculative ownership of digital tokens with arbitrary metadata links that anyone can mint. ArtLedger is an **institutional provenance protocol**:
> 1. Only verified artists can mint.
> 2. The physical asset's cryptographic fingerprint is anchored directly in contract memory.
> 3. Only certified galleries, restorers, and appraisers can record custody and condition logs.

### Q2: What if someone uploads a counterfeit painting first?
> **Answer**: ArtLedger requires `ARTIST_ROLE` or certified gallery accreditation to register works. Furthermore, every entry has an immutable blockchain block timestamp. Even if an unauthorized party created an entry elsewhere, the legitimate artist's earlier timestamp and authorized institution endorsements prove primacy and authenticity.

### Q3: How does the verification function work?
> **Answer**: The candidate file is hashed client-side using SHA-256 and sent to the smart contract view function `verifyImageHash(tokenId, candidateHash)`. The EVM performs a direct binary comparison against the stored hash in $O(1)$ time, without gas cost.

---

*Authored by the ArtLedger Development Team for Presentation & Pitch Review.*

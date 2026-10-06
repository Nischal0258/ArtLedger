# ArtLedger — Live Demo & Presentation Walkthrough

> **Judge-Ready Hackathon Showcase Script**  
> Demonstrates solving art forgery and missing ownership records using ERC-721 tokenization, institutional RBAC, and client-side cryptographic image verification.

---

## 3-Minute Demo Flow

### Step 1: Connect Wallet & Identity
1. Open [http://localhost:3000](http://localhost:3000) (or your deployed URL).
2. Point out the **Navbar**:
   - Theme toggle (Light / Dark mode).
   - Network status badge (**Sepolia Testnet**).
   - Click **Connect Wallet** (RainbowKit).
   - Show the dynamic Curator Role badge next to your address (`🎨 Artist`, `🏛️ Gallery`, or `Shield Admin`).

### Step 2: Register a Masterpiece (`/mint`)
1. Click **Register Artwork** in the navbar.
2. Drag-and-drop an artwork photo into the dropzone.
3. Show the judges:
   - **Client-Side SHA-256 Digest**: Computed in milliseconds via the browser Web Crypto API before anything touches the network.
   - **Decentralized IPFS Pinning**: The image is pinned to Pinata/IPFS, and the CID is auto-populated.
4. Fill in:
   - **Title**: `Salvator Mundi`
   - **Artist**: `Leonardo da Vinci`
   - **Year**: `1500`
   - **Medium**: `Oil on Walnut Panel`
5. Click **Sign & Mint Provenance NFT**.
6. The confirmation modal reviews immutable parameters; sign transaction in MetaMask.
7. Confetti celebration appears, confirming on-chain token creation!

### Step 3: Explore the Public Provenance Timeline (`/artwork/0`)
1. Open the artwork's timeline page.
2. Highlight the key components:
   - **Artwork Header**: Media preview, completion year, medium, and permanent SHA-256 digest.
   - **Genesis Mint Event**: Automatically sealed at the moment of creation.
   - **Physical Frame Label (QR Code)**: Click **Download Frame Label** to show how a physical museum placard links collectors directly to this blockchain entry.

### Step 4: Institutional Multi-Role Provenance Logging
Demonstrate role segregation by logging events from approved entities:
1. **Gallery Event** (`GALLERY_ROLE`):
   - Switch wallet or select **Custody Transfer** in the **Curator Action Panel**.
   - Enter: *"Loaned to National Gallery London for retrospective exhibition."*
   - Location: *"London, UK"*
   - Submit transaction -> instantly visible in the vertical timeline.
2. **Restorer Event** (`RESTORER_ROLE`):
   - Select **Restoration Work**.
   - Enter: *"Varnish stabilization and infrared reflectography scan."*
   - Location: *"Atelier di Conservazione, Florence"*
   - Submit transaction -> recorded under `Restorer` badge.
3. **Appraiser Event** (`APPRAISER_ROLE`):
   - Select **Appraisal & Valuation**.
   - Enter: *"Official insurance valuation certified at $450,000,000."*
   - Location: *"Christie's New York"*
   - Submit transaction -> recorded under `Appraiser` badge.
4. Show the complete timeline: 4 immutable events spanning the artwork's lifecycle!

### Step 5: Zero-Trust Verification Utility (`/verify`)
1. Navigate to **Verify Authenticity** (`/verify`).
2. Enter Token ID: `0`.
3. Test 1 (Original Photo):
   - Upload the identical original image.
   - The computed hash matches the on-chain record.
   - Result: **VERIFIED AUTHENTIC ORIGINAL** (Green badge).
4. Test 2 (Altered / Forged Copy):
   - Upload any slightly cropped, compressed, or different picture.
   - Result: **HASH MISMATCH DETECTED** (Red warning banner).
   - Explain to judges: Even 1 pixel alteration produces a completely different hash, catching counterfeits immediately.

---

## 1-Minute Elevator Pitch

> *"ArtLedger brings cryptographic trust to physical and digital fine art. We bind high-resolution artwork files to ERC-721 tokens using client-side SHA-256 fingerprints, and enforce institutional access control so only certified galleries, restorers, and appraisers can record custody and restoration events. Anyone can scan a physical frame's QR tag or upload a photo to verify authenticity in under five seconds."*

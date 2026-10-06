# ArtLedger

> **NFT-Based Art Provenance Tracker** — Solving art forgery and missing ownership records with immutable on-chain custody events.

## Quick Start

### Prerequisites
- Node.js 18+
- MetaMask browser extension
- Sepolia testnet ETH ([faucet](https://sepoliafaucet.com))

### Setup

```bash
# Clone
git clone https://github.com/Nischal0258/ArtLedger.git
cd ArtLedger

# Blockchain
cd blockchain
npm install
npx hardhat compile
npx hardhat test

# Frontend
cd ../frontend
npm install
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

## Architecture

- **Smart Contract:** Solidity 0.8.20 + OpenZeppelin (ERC-721 + AccessControl)
- **Frontend:** Next.js 14 + Tailwind CSS + RainbowKit + wagmi
- **Storage:** Pinata/IPFS for images and metadata
- **Testnet:** Sepolia

## Features

- 🎨 Artwork Registration — Mint NFTs with artist info, medium, year, and cryptographic image hash
- 🔐 Role-Based Access — Only approved Artists, Galleries, Restorers, and Appraisers can log events
- 📜 Provenance Timeline — Chronological on-chain history of every custody event
- 🔬 Image Verification — Client-side SHA-256 hash comparison against on-chain records
- 📱 QR Code Labels — Link physical artwork to its digital timeline
- ⚠️ Unauthorized Warnings — On-chain events when unauthorized parties attempt actions

## License

MIT

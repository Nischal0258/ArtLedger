const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ArtLedger Smart Contract", function () {
  let artLedger;
  let admin, artist, gallery, restorer, appraiser, unauthorizedUser;

  // Roles keccak256
  const ARTIST_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ARTIST_ROLE"));
  const GALLERY_ROLE = ethers.keccak256(ethers.toUtf8Bytes("GALLERY_ROLE"));
  const RESTORER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("RESTORER_ROLE"));
  const APPRAISER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("APPRAISER_ROLE"));

  // Mock Artwork parameters
  const sampleArtwork = {
    artistName: "Leonardo da Vinci",
    title: "Salvator Mundi",
    year: 1500,
    medium: "Oil on Walnut Panel",
    imageHash: ethers.keccak256(ethers.toUtf8Bytes("salvator-mundi-original-image")),
    ipfsCID: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    tokenURI: "ipfs://QmZtmD2qtNmR43eDHxNWBbzjGndEwmFqjZBv69b9aXWC2q/metadata.json",
  };

  beforeEach(async function () {
    [admin, artist, gallery, restorer, appraiser, unauthorizedUser] = await ethers.getSigners();

    const ArtLedgerFactory = await ethers.getContractFactory("ArtLedger");
    artLedger = await ArtLedgerFactory.deploy();
    await artLedger.waitForDeployment();

    // Grant roles from admin
    await artLedger.grantArtistRole(artist.address);
    await artLedger.grantGalleryRole(gallery.address);
    await artLedger.grantRestorerRole(restorer.address);
    await artLedger.grantAppraiserRole(appraiser.address);
  });

  describe("Deployment & Access Control", function () {
    it("Should set correct name and symbol", async function () {
      expect(await artLedger.name()).to.equal("ArtLedger");
      expect(await artLedger.symbol()).to.equal("ARTL");
    });

    it("Should configure roles properly for signers", async function () {
      expect(await artLedger.hasRole(ARTIST_ROLE, artist.address)).to.be.true;
      expect(await artLedger.hasRole(GALLERY_ROLE, gallery.address)).to.be.true;
      expect(await artLedger.hasRole(RESTORER_ROLE, restorer.address)).to.be.true;
      expect(await artLedger.hasRole(APPRAISER_ROLE, appraiser.address)).to.be.true;
      expect(await artLedger.hasRole(ARTIST_ROLE, unauthorizedUser.address)).to.be.false;
    });

    it("Should reject non-admin role grants", async function () {
      await expect(
        artLedger.connect(unauthorizedUser).grantGalleryRole(unauthorizedUser.address)
      ).to.be.revertedWithCustomError(artLedger, "AccessControlUnauthorizedAccount");
    });
  });

  describe("Artwork Minting", function () {
    it("Should allow an artist to mint a new artwork", async function () {
      const tx = await artLedger.connect(artist).mintArtwork(
        sampleArtwork.artistName,
        sampleArtwork.title,
        sampleArtwork.year,
        sampleArtwork.medium,
        sampleArtwork.imageHash,
        sampleArtwork.ipfsCID,
        sampleArtwork.tokenURI
      );

      await expect(tx)
        .to.emit(artLedger, "ArtworkMinted")
        .withArgs(0, artist.address, sampleArtwork.title, sampleArtwork.imageHash, sampleArtwork.ipfsCID);

      expect(await artLedger.ownerOf(0)).to.equal(artist.address);
      expect(await artLedger.tokenURI(0)).to.equal(sampleArtwork.tokenURI);
      expect(await artLedger.totalSupply()).to.equal(1);
    });

    it("Should prevent non-artists from minting", async function () {
      await expect(
        artLedger.connect(unauthorizedUser).mintArtwork(
          sampleArtwork.artistName,
          sampleArtwork.title,
          sampleArtwork.year,
          sampleArtwork.medium,
          sampleArtwork.imageHash,
          sampleArtwork.ipfsCID,
          sampleArtwork.tokenURI
        )
      ).to.be.revertedWithCustomError(artLedger, "AccessControlUnauthorizedAccount");
    });

    it("Should automatically initialize the provenance timeline upon minting", async function () {
      await artLedger.connect(artist).mintArtwork(
        sampleArtwork.artistName,
        sampleArtwork.title,
        sampleArtwork.year,
        sampleArtwork.medium,
        sampleArtwork.imageHash,
        sampleArtwork.ipfsCID,
        sampleArtwork.tokenURI
      );

      const count = await artLedger.getProvenanceCount(0);
      expect(count).to.equal(1);

      const timeline = await artLedger.getProvenance(0);
      expect(timeline[0].eventType).to.equal(0); // EventType.Minted
      expect(timeline[0].actor).to.equal(artist.address);
      expect(timeline[0].actorRole).to.equal(ARTIST_ROLE);
      expect(timeline[0].location).to.equal("Origin Studio");
    });
  });

  describe("Provenance & Custody Event Logging", function () {
    beforeEach(async function () {
      await artLedger.connect(artist).mintArtwork(
        sampleArtwork.artistName,
        sampleArtwork.title,
        sampleArtwork.year,
        sampleArtwork.medium,
        sampleArtwork.imageHash,
        sampleArtwork.ipfsCID,
        sampleArtwork.tokenURI
      );
    });

    it("Should allow Gallery, Restorer, and Appraiser to append custody events", async function () {
      // 1. Gallery records custody transfer / exhibition
      await expect(
        artLedger.connect(gallery).logCustodyEvent(
          0,
          1, // CustodyTransfer
          "Transferred to National Gallery London for retrospective loan",
          "London, UK"
        )
      ).to.emit(artLedger, "CustodyEventLogged");

      // 2. Restorer records conservation treatment
      await artLedger.connect(restorer).logCustodyEvent(
        0,
        3, // Restoration
        "Varnish stabilization and spectral infrared reflectography scan",
        "Atelier Conservation Lab, Florence"
      );

      // 3. Appraiser logs market valuation
      await artLedger.connect(appraiser).logCustodyEvent(
        0,
        4, // Appraisal
        "Inspected and insured valuation certified at $450,000,000",
        "Christie's New York"
      );

      // Total events should now be 4: 1 initial mint + 3 logged events
      expect(await artLedger.getProvenanceCount(0)).to.equal(4);

      const events = await artLedger.getProvenance(0);
      expect(events[1].eventType).to.equal(1); // CustodyTransfer
      expect(events[1].actor).to.equal(gallery.address);
      expect(events[1].actorRole).to.equal(GALLERY_ROLE);
      expect(events[1].location).to.equal("London, UK");

      expect(events[2].eventType).to.equal(3); // Restoration
      expect(events[2].actor).to.equal(restorer.address);
      expect(events[2].actorRole).to.equal(RESTORER_ROLE);

      expect(events[3].eventType).to.equal(4); // Appraisal
      expect(events[3].actor).to.equal(appraiser.address);
      expect(events[3].actorRole).to.equal(APPRAISER_ROLE);
    });

    it("Should reject custody event logging from unauthorized entities and revert", async function () {
      await expect(
        artLedger.connect(unauthorizedUser).logCustodyEvent(
          0,
          1,
          "Fraudulent custody claim attempt",
          "Unknown Location"
        )
      ).to.be.revertedWith("Caller lacks an authorized role");
    });
  });

  describe("Cryptographic Image Verification Utility", function () {
    beforeEach(async function () {
      await artLedger.connect(artist).mintArtwork(
        sampleArtwork.artistName,
        sampleArtwork.title,
        sampleArtwork.year,
        sampleArtwork.medium,
        sampleArtwork.imageHash,
        sampleArtwork.ipfsCID,
        sampleArtwork.tokenURI
      );
    });

    it("Should return true for identical image hash", async function () {
      const isAuthentic = await artLedger.verifyImageHash(0, sampleArtwork.imageHash);
      expect(isAuthentic).to.be.true;
    });

    it("Should return false for altered image hash (counterfeit detected)", async function () {
      const counterfeitHash = ethers.keccak256(ethers.toUtf8Bytes("counterfeit-copy-with-modifications"));
      const isAuthentic = await artLedger.verifyImageHash(0, counterfeitHash);
      expect(isAuthentic).to.be.false;
    });
  });
});

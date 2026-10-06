// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ArtLedger
 * @notice Decentralized provenance & custody tracking protocol for physical & digital fine art.
 * @dev Combines ERC-721 token standards with OpenZeppelin AccessControl for institutional role segregation.
 */
contract ArtLedger is ERC721URIStorage, AccessControl, ReentrancyGuard {

    // ══════════════════════════════════════════════════════════
    //  ROLES (KECCAK-256 IDENTIFIERS)
    // ══════════════════════════════════════════════════════════
    bytes32 public constant ARTIST_ROLE    = keccak256("ARTIST_ROLE");
    bytes32 public constant GALLERY_ROLE   = keccak256("GALLERY_ROLE");
    bytes32 public constant RESTORER_ROLE  = keccak256("RESTORER_ROLE");
    bytes32 public constant APPRAISER_ROLE = keccak256("APPRAISER_ROLE");

    // ══════════════════════════════════════════════════════════
    //  ENUMS
    // ══════════════════════════════════════════════════════════
    enum EventType {
        Minted,          // 0: Initial cryptographic creation
        CustodyTransfer, // 1: Transfer of physical or legal custody
        Exhibition,      // 2: Institutional display or loan
        Restoration,     // 3: Conservation, structural stabilization, or repair
        Appraisal,       // 4: Valuation, authentic verification, or insurance audit
        StorageUpdate    // 5: Relocation to secure vault or facility
    }

    // ══════════════════════════════════════════════════════════
    //  STRUCTS
    // ══════════════════════════════════════════════════════════
    struct Artwork {
        string  artistName;
        string  title;
        uint16  year;
        string  medium;
        bytes32 imageHash;     // Cryptographic SHA-256 fingerprint of the original artwork image
        string  ipfsCID;       // Decentralized storage identifier
        uint256 mintedAt;      // Block timestamp of creation
        address mintedBy;      // Minting artist address
    }

    struct CustodyEvent {
        EventType eventType;
        address   actor;       // Curator or institution performing the action
        bytes32   actorRole;   // Role claimed by the actor
        uint256   timestamp;   // Block timestamp
        string    description; // Descriptive notes or report summary
        string    location;    // Physical facility, city, or museum
    }

    // ══════════════════════════════════════════════════════════
    //  STATE VARIABLES
    // ══════════════════════════════════════════════════════════
    uint256 private _nextTokenId;

    mapping(uint256 => Artwork) private _artworks;
    mapping(uint256 => CustodyEvent[]) private _provenanceLog;

    // ══════════════════════════════════════════════════════════
    //  EVENTS
    // ══════════════════════════════════════════════════════════
    event ArtworkMinted(
        uint256 indexed tokenId,
        address indexed artist,
        string  title,
        bytes32 imageHash,
        string  ipfsCID
    );

    event CustodyEventLogged(
        uint256 indexed tokenId,
        EventType indexed eventType,
        address indexed actor,
        bytes32 actorRole,
        uint256 timestamp,
        string  location
    );

    event UnauthorizedAttempt(
        uint256 indexed tokenId,
        address indexed caller,
        string  reason
    );

    // ══════════════════════════════════════════════════════════
    //  CONSTRUCTOR
    // ══════════════════════════════════════════════════════════
    constructor() ERC721("ArtLedger", "ARTL") {
        // Deployer is initial Admin and default Artist for bootstrapping
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ARTIST_ROLE, msg.sender);
    }

    // ══════════════════════════════════════════════════════════
    //  MINTING LOGIC (Role-Gated: ARTIST_ROLE)
    // ══════════════════════════════════════════════════════════
    /**
     * @notice Registers a new artwork on-chain as an ERC-721 token and initializes its provenance timeline.
     * @param artistName Name of the primary creator
     * @param title Title of the work
     * @param year Year completed
     * @param medium Medium (e.g., "Oil on Linen", "Digital 3D", "Bronze")
     * @param imageHash SHA-256 cryptographic digest of the primary media file
     * @param ipfsCID IPFS CID of the image file
     * @param tokenURI_ IPFS URI pointing to the ERC-721 metadata JSON
     */
    function mintArtwork(
        string  calldata artistName,
        string  calldata title,
        uint16           year,
        string  calldata medium,
        bytes32          imageHash,
        string  calldata ipfsCID,
        string  calldata tokenURI_
    ) external onlyRole(ARTIST_ROLE) nonReentrant returns (uint256) {
        require(bytes(artistName).length > 0, "Artist name is required");
        require(bytes(title).length > 0, "Title is required");
        require(imageHash != bytes32(0), "Invalid image hash");

        uint256 tokenId = _nextTokenId++;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        _artworks[tokenId] = Artwork({
            artistName: artistName,
            title:      title,
            year:       year,
            medium:     medium,
            imageHash:  imageHash,
            ipfsCID:    ipfsCID,
            mintedAt:   block.timestamp,
            mintedBy:   msg.sender
        });

        // Automatically log Genesis "Minted" event to provenance
        _provenanceLog[tokenId].push(CustodyEvent({
            eventType:   EventType.Minted,
            actor:       msg.sender,
            actorRole:   ARTIST_ROLE,
            timestamp:   block.timestamp,
            description: "Artwork minted and registered to ArtLedger registry",
            location:    "Origin Studio"
        }));

        emit ArtworkMinted(tokenId, msg.sender, title, imageHash, ipfsCID);
        emit CustodyEventLogged(tokenId, EventType.Minted, msg.sender, ARTIST_ROLE, block.timestamp, "Origin Studio");

        return tokenId;
    }

    // ══════════════════════════════════════════════════════════
    //  PROVENANCE LOGGING (Role-Gated: Any Authorized Role)
    // ══════════════════════════════════════════════════════════
    /**
     * @notice Records an authenticated lifecycle event for a specified artwork.
     * @param tokenId Target artwork token ID
     * @param eventType Type of event being recorded
     * @param description Detailed summary of the event
     * @param location Facility or location where the event took place
     */
    function logCustodyEvent(
        uint256          tokenId,
        EventType        eventType,
        string  calldata description,
        string  calldata location
    ) external nonReentrant {
        bytes32 callerRole = resolveCallerRole(msg.sender);

        if (callerRole == bytes32(0)) {
            emit UnauthorizedAttempt(tokenId, msg.sender, "Caller lacks an authorized role");
            revert("Caller lacks an authorized role");
        }

        require(_ownerOf(tokenId) != address(0), "Artwork does not exist");
        require(bytes(description).length > 0, "Description cannot be empty");

        _provenanceLog[tokenId].push(CustodyEvent({
            eventType:   eventType,
            actor:       msg.sender,
            actorRole:   callerRole,
            timestamp:   block.timestamp,
            description: description,
            location:    location
        }));

        emit CustodyEventLogged(tokenId, eventType, msg.sender, callerRole, block.timestamp, location);
    }

    // ══════════════════════════════════════════════════════════
    //  READ VIEWS
    // ══════════════════════════════════════════════════════════
    /**
     * @notice Retrieves the full recorded provenance log for an artwork.
     */
    function getProvenance(uint256 tokenId) external view returns (CustodyEvent[] memory) {
        require(_ownerOf(tokenId) != address(0), "Artwork does not exist");
        return _provenanceLog[tokenId];
    }

    /**
     * @notice Retrieves total number of recorded provenance entries.
     */
    function getProvenanceCount(uint256 tokenId) external view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Artwork does not exist");
        return _provenanceLog[tokenId].length;
    }

    /**
     * @notice Retrieves artwork metadata and cryptographic properties.
     */
    function getArtwork(uint256 tokenId) external view returns (Artwork memory) {
        require(_ownerOf(tokenId) != address(0), "Artwork does not exist");
        return _artworks[tokenId];
    }

    /**
     * @notice Returns total number of minted artworks on the ledger.
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @notice Verifies whether a candidate image hash matches the registered original.
     */
    function verifyImageHash(uint256 tokenId, bytes32 candidateHash) external view returns (bool) {
        require(_ownerOf(tokenId) != address(0), "Artwork does not exist");
        return _artworks[tokenId].imageHash == candidateHash;
    }

    /**
     * @notice Determines the highest-privilege role held by an address.
     */
    function resolveCallerRole(address account) public view returns (bytes32) {
        if (hasRole(DEFAULT_ADMIN_ROLE, account)) return DEFAULT_ADMIN_ROLE;
        if (hasRole(ARTIST_ROLE, account))        return ARTIST_ROLE;
        if (hasRole(GALLERY_ROLE, account))       return GALLERY_ROLE;
        if (hasRole(RESTORER_ROLE, account))      return RESTORER_ROLE;
        if (hasRole(APPRAISER_ROLE, account))     return APPRAISER_ROLE;
        return bytes32(0);
    }

    // ══════════════════════════════════════════════════════════
    //  ROLE MANAGEMENT (Admin Only)
    // ══════════════════════════════════════════════════════════
    function grantArtistRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(ARTIST_ROLE, account);
    }

    function grantGalleryRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(GALLERY_ROLE, account);
    }

    function grantRestorerRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(RESTORER_ROLE, account);
    }

    function grantAppraiserRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(APPRAISER_ROLE, account);
    }

    // ══════════════════════════════════════════════════════════
    //  INTERFACE OVERRIDES
    // ══════════════════════════════════════════════════════════
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

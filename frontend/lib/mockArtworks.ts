import { EventType } from "./constants";

export interface MockArtwork {
  tokenId: number;
  artistName: string;
  title: string;
  year: number;
  medium: string;
  imageHash: `0x${string}`;
  ipfsCID: string;
  imageUrl: string;
  mintedAt: bigint;
  mintedBy: `0x${string}`;
  currentOwner: `0x${string}`;
  status: "Verified On-Chain" | "In Exhibition" | "Restored" | "Appraised";
  eventsCount: number;
  description: string;
}

export interface MockProvenanceEvent {
  eventType: EventType;
  actor: `0x${string}`;
  actorRole: string;
  timestamp: bigint;
  description: string;
  location: string;
}

export const MOCK_ARTWORKS: MockArtwork[] = [
  {
    tokenId: 0,
    artistName: "Leonardo da Vinci",
    title: "Salvator Mundi",
    year: 1500,
    medium: "Oil on Walnut Panel",
    imageHash: "0x7eb6a29f860538a8e32c8427f717dd2ba14a8449c25f385c54c30c33ef1f2117",
    ipfsCID: "QmSalvatorMundiProvenanceMasterpieceV1",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85",
    mintedAt: BigInt(1710000000),
    mintedBy: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    currentOwner: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    status: "Verified On-Chain",
    eventsCount: 4,
    description: "Depicting Jesus Christ in an enigmatic Renaissance blue robe holding a crystal orb, representing celestial sphere and salvation.",
  },
  {
    tokenId: 1,
    artistName: "Johannes Vermeer",
    title: "Girl with a Pearl Earring",
    year: 1665,
    medium: "Oil on Canvas",
    imageHash: "0x3a9f0e1d2c4b5a67890123456789abcdef0123456789abcdef0123456789abcd",
    ipfsCID: "QmPearlEarringMauritshuisCertified1665",
    imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=85",
    mintedAt: BigInt(1710100000),
    mintedBy: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    currentOwner: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    status: "In Exhibition",
    eventsCount: 5,
    description: "Celebrated Dutch Golden Age tronie capturing an intimate glance, oriental turban, and iconic reflective pearl earring.",
  },
  {
    tokenId: 2,
    artistName: "Vincent van Gogh",
    title: "The Starry Night",
    year: 1889,
    medium: "Oil on Canvas",
    imageHash: "0x89abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567",
    ipfsCID: "QmStarryNightMoMANewYorkArchive1889",
    imageUrl: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85",
    mintedAt: BigInt(1710200000),
    mintedBy: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    currentOwner: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    status: "Restored",
    eventsCount: 6,
    description: "Masterpiece painted from Saint-Paul asylum room showing turbulent swirling sky over the quiet village of Saint-Rémy.",
  },
  {
    tokenId: 3,
    artistName: "Piet Mondrian",
    title: "Composition with Red, Blue and Yellow",
    year: 1930,
    medium: "Oil on Canvas",
    imageHash: "0x56789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234",
    ipfsCID: "QmMondrianGeometricModernismDeStijl1930",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85",
    mintedAt: BigInt(1710300000),
    mintedBy: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    currentOwner: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    status: "Appraised",
    eventsCount: 3,
    description: "Pivotal De Stijl geometric abstraction utilizing thick black grids and pure primary color blocks to achieve universal aesthetic equilibrium.",
  },
  {
    tokenId: 4,
    artistName: "Gustav Klimt",
    title: "The Kiss (Der Kuss)",
    year: 1908,
    medium: "Oil and Gold Leaf on Canvas",
    imageHash: "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0",
    ipfsCID: "QmGustavKlimtDerKussBelvedereVienna1908",
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85",
    mintedAt: BigInt(1710400000),
    mintedBy: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    currentOwner: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    status: "In Exhibition",
    eventsCount: 4,
    description: "High point of Klimt's Golden Period, depicting an embracing couple veiled in ornate decorative robes and shimmering gilded patterns.",
  },
  {
    tokenId: 5,
    artistName: "Claude Monet",
    title: "Impression, Sunrise",
    year: 1872,
    medium: "Oil on Canvas",
    imageHash: "0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
    ipfsCID: "QmMonetImpressionSunriseMarmottan1872",
    imageUrl: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&w=1200&q=85",
    mintedAt: BigInt(1710500000),
    mintedBy: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    currentOwner: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    status: "Verified On-Chain",
    eventsCount: 4,
    description: "The seminal work that gave the Impressionist movement its name, depicting the morning port of Le Havre through loose atmospheric brushwork.",
  },
  {
    tokenId: 6,
    artistName: "Auguste Rodin",
    title: "The Thinker (Le Penseur)",
    year: 1904,
    medium: "Bronze Sculpture",
    imageHash: "0x456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123",
    ipfsCID: "QmRodinThinkerBronzeSculptureParis1904",
    imageUrl: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=85",
    mintedAt: BigInt(1710600000),
    mintedBy: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    currentOwner: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    status: "Restored",
    eventsCount: 5,
    description: "Monumental cast bronze figure lost in deep philosophical contemplation, originally conceived as Dante before the Gates of Hell.",
  },
  {
    tokenId: 7,
    artistName: "Claude Monet",
    title: "Water Lilies (Nymphéas)",
    year: 1916,
    medium: "Oil on Canvas",
    imageHash: "0x789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456",
    ipfsCID: "QmMonetWaterLiliesNympheasOrangerie1916",
    imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1200&q=85",
    mintedAt: BigInt(1710700000),
    mintedBy: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    currentOwner: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    status: "Appraised",
    eventsCount: 3,
    description: "Monumental impressionist meditation on light, water reflections, and blooming flora from Monet's water garden at Giverny.",
  },
];

export const MOCK_PROVENANCE_EVENTS: Record<number, MockProvenanceEvent[]> = {
  0: [
    {
      eventType: EventType.Minted,
      actor: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      actorRole: "Master Curator & Deployer",
      timestamp: BigInt(1710000000),
      description: "Genesis minting and cryptographic SHA-256 seal anchored to Ethereum ledger.",
      location: "Florence, Italy",
    },
    {
      eventType: EventType.CustodyTransfer,
      actor: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      actorRole: "Certified Gallery Partner",
      timestamp: BigInt(1710086400),
      description: "Acquisition and international loan agreement executed for National Gallery exhibition.",
      location: "National Gallery, London",
    },
    {
      eventType: EventType.Restoration,
      actor: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      actorRole: "Senior Art Conservator",
      timestamp: BigInt(1710172800),
      description: "Infrared reflectography, multi-spectral surface scan, and non-destructive varnish stabilization.",
      location: "Conservation Lab, Florence",
    },
    {
      eventType: EventType.Appraisal,
      actor: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      actorRole: "Master Valuation Appraiser",
      timestamp: BigInt(1710259200),
      description: "Comprehensive authenticity certification and independent institutional valuation audit ($450,000,000 USD).",
      location: "Christie's New York, NY",
    },
  ],
  1: [
    {
      eventType: EventType.Minted,
      actor: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      actorRole: "Genesis Fine Artist",
      timestamp: BigInt(1710100000),
      description: "Genesis minting and SHA-256 pigment verification.",
      location: "The Hague, Netherlands",
    },
    {
      eventType: EventType.Exhibition,
      actor: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      actorRole: "Certified Gallery Partner",
      timestamp: BigInt(1710190000),
      description: "Displayed in 'Masters of Light' exhibition at Mauritshuis.",
      location: "Mauritshuis, The Hague",
    },
    {
      eventType: EventType.Restoration,
      actor: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      actorRole: "Senior Art Conservator",
      timestamp: BigInt(1710280000),
      description: "Ultra-high resolution 3D digital microscopy and micro-pigment sampling.",
      location: "Amsterdam Art Conservation Centre",
    },
    {
      eventType: EventType.Appraisal,
      actor: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      actorRole: "Master Valuation Appraiser",
      timestamp: BigInt(1710370000),
      description: "Sotheby's Heritage valuation certification and museum insurance rating.",
      location: "London, UK",
    },
    {
      eventType: EventType.StorageUpdate,
      actor: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      actorRole: "Certified Gallery Partner",
      timestamp: BigInt(1710460000),
      description: "Relocated to climate-controlled archival security vault (21°C, 50% RH).",
      location: "Geneva Free Port Vault",
    },
  ],
  2: [
    {
      eventType: EventType.Minted,
      actor: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      actorRole: "Genesis Fine Artist",
      timestamp: BigInt(1710200000),
      description: "Registered into immutable ledger with certified digital scan hash.",
      location: "Saint-Rémy-de-Provence, France",
    },
    {
      eventType: EventType.CustodyTransfer,
      actor: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      actorRole: "Certified Gallery Partner",
      timestamp: BigInt(1710300000),
      description: "Accessioned into modern masterworks permanent collection.",
      location: "Museum of Modern Art, New York",
    },
    {
      eventType: EventType.Restoration,
      actor: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      actorRole: "Senior Art Conservator",
      timestamp: BigInt(1710400000),
      description: "Lining canvas stabilization and laser cleaning of aged surface dust.",
      location: "MoMA Conservation Studio, NY",
    },
    {
      eventType: EventType.Appraisal,
      actor: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      actorRole: "Master Valuation Appraiser",
      timestamp: BigInt(1710500000),
      description: "Institutional appraisal audit certified at $100M+ priceless rating.",
      location: "New York, NY",
    },
    {
      eventType: EventType.Exhibition,
      actor: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      actorRole: "Certified Gallery Partner",
      timestamp: BigInt(1710600000),
      description: "Special retrospective exhibition loan.",
      location: "Musée d'Orsay, Paris",
    },
    {
      eventType: EventType.StorageUpdate,
      actor: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      actorRole: "Senior Art Conservator",
      timestamp: BigInt(1710700000),
      description: "Returned to high-security climate-controlled permanent MoMA wing.",
      location: "MoMA Gallery 503, New York",
    },
  ],
};

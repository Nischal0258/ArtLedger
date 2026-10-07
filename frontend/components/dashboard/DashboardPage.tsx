"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  ShieldCheck,
  Search,
  Mail,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Share2,
  UploadCloud,
  Star,
  Plus,
  Database,
  Calendar,
  Send,
  Shield,
  Layers,
  Sparkles,
  Palette,
  Landmark,
  Hammer,
  BadgeDollarSign,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  FileSearch,
  PlusCircle,
  RefreshCw,
  Award,
  Upload,
  XCircle,
  Fingerprint,
  Lock,
  ArrowRightLeft,
  User,
  Settings,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Box,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import { useAuth, UserRole, ROLE_DEFAULTS } from "@/context/AuthContext";
import {
  MOCK_ARTWORKS,
  MOCK_PROVENANCE_EVENTS,
  MockArtwork,
  MockProvenanceEvent,
} from "@/lib/mockArtworks";
import { EventType } from "@/lib/constants";
import { computeSHA256 } from "@/lib/hash";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";
import { toast } from "sonner";

// Import role-specific consoles
import { ArtistDashboardView } from "./ArtistDashboardView";
import { GalleryDashboardView } from "./GalleryDashboardView";
import { RestorerDashboardView } from "./RestorerDashboardView";
import { AppraiserDashboardView } from "./AppraiserDashboardView";
import { AdminDashboardView } from "./AdminDashboardView";

export function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, switchRole, logout } = useAuth();

  // Navigation tab inside the dashboard
  const [activeTab, setActiveTab] = useState<
    "journey" | "role-tools" | "register" | "portfolio" | "verifications" | "history" | "governance"
  >("journey");

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Profile Popover Modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isSwitchRoleExpanded, setIsSwitchRoleExpanded] = useState<boolean>(false);

  // Address copy state
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Masterpiece Registry filter & search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMediumFilter, setSelectedMediumFilter] = useState<string>("All");

  // Local state for registered artworks (initialized with 12 mock artworks)
  const [artworksList, setArtworksList] = useState<MockArtwork[]>(MOCK_ARTWORKS);

  // Local state for provenance events
  const [provenanceEvents, setProvenanceEvents] =
    useState<Record<number, MockProvenanceEvent[]>>(MOCK_PROVENANCE_EVENTS);

  // Selected artwork for in-dashboard modal
  const [inspectArtworkId, setInspectArtworkId] = useState<number | null>(null);

  // In-Dashboard Registration Wizard State
  const [newTitle, setNewTitle] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [newYear, setNewYear] = useState<number>(new Date().getFullYear());
  const [newMedium, setNewMedium] = useState("Oil on Linen Canvas");
  const [newValuation, setNewValuation] = useState("$12,500,000");
  const [newDescription, setNewDescription] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newFilePreview, setNewFilePreview] = useState<string | null>(null);
  const [newComputedHash, setNewComputedHash] = useState<string>("");
  const [isHashingMintFile, setIsHashingMintFile] = useState<boolean>(false);
  const [isMintingOnChain, setIsMintingOnChain] = useState<boolean>(false);

  // Forensic Verifier State
  const [verifyTokenId, setVerifyTokenId] = useState<number>(0);
  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [verifyFilePreview, setVerifyFilePreview] = useState<string | null>(null);
  const [verifyComputedHash, setVerifyComputedHash] = useState<string>("");
  const [isVerifyingHash, setIsVerifyingHash] = useState<boolean>(false);

  // In-modal quick action state for logging events
  const [modalActionDescription, setModalActionDescription] = useState("");
  const [modalActionLocation, setModalActionLocation] = useState("");

  const selectedVerifyArtwork =
    artworksList.find((a) => a.tokenId === verifyTokenId) || artworksList[0];

  const inspectedArtwork =
    inspectArtworkId !== null
      ? artworksList.find((a) => a.tokenId === inspectArtworkId) || null
      : null;

  // Auto-fill artist name when user is an Artist
  useEffect(() => {
    if (user && user.role === "Artist" && !newArtist) {
      setNewArtist(user.name);
    }
  }, [user, newArtist]);

  // Protected Route Guard: If not authenticated, redirect to "/"
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F3F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#DBBA95] border-t-[#F07BAF] rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#686878]">Launching ArtLedger Curator Workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopyAddress = () => {
    if (!user.address) return;
    navigator.clipboard.writeText(user.address);
    setCopiedAddress(true);
    toast.success("Wallet address copied to clipboard");
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  // Role permissions checker
  const canRegister = user.role === "Artist" || user.role === "Admin";
  const canAccessGovernance = user.role === "Admin";

  // Tab switch handler with permission checking
  const handleTabSelect = (tab: typeof activeTab) => {
    if (tab === "register" && !canRegister) {
      toast.error("Access Restricted: Only certified Artists or Admins can register new masterpieces.");
      return;
    }
    if (tab === "governance" && !canAccessGovernance) {
      toast.error("Access Restricted: Administrator privileges required for protocol governance.");
      return;
    }
    setActiveTab(tab);
  };

  // File hashing for registration
  const handleMintFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewFile(file);
    setNewFilePreview(URL.createObjectURL(file));
    setIsHashingMintFile(true);
    try {
      const hash = await computeSHA256(file);
      setNewComputedHash(hash);
      toast.success("Cryptographic SHA-256 fingerprint generated!");
    } catch {
      toast.error("Failed to hash file");
    } finally {
      setIsHashingMintFile(false);
    }
  };

  // Execute in-dashboard minting
  const handleExecuteMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter artwork title");
      return;
    }
    if (!newArtist.trim()) {
      toast.error("Please enter artist name");
      return;
    }
    if (!newComputedHash) {
      toast.error("Please attach artwork image to compute SHA-256 fingerprint");
      return;
    }

    setIsMintingOnChain(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const nextTokenId = artworksList.length;
      const ipfsCID = `Qm${newComputedHash.slice(2, 28)}ArtLedgerMuseum`;

      const newArtworkObj: MockArtwork = {
        tokenId: nextTokenId,
        artistName: newArtist.trim(),
        title: newTitle.trim(),
        year: Number(newYear),
        medium: newMedium.trim(),
        imageHash: newComputedHash as `0x${string}`,
        ipfsCID,
        imageUrl:
          newFilePreview ||
          "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=85",
        mintedAt: BigInt(Math.floor(Date.now() / 1000)),
        mintedBy: user.address as `0x${string}`,
        currentOwner: user.address as `0x${string}`,
        status: "Verified On-Chain",
        eventsCount: 1,
        description:
          newDescription.trim() ||
          `Original certified physical masterpiece by ${newArtist.trim()}, sealed onto Ethereum with immutable cryptographic hash.`,
        valuation: newValuation.trim() || "$10,000,000",
        conditionRating: "Pristine Genesis (Grade A+)",
        insuranceGrade: "AAA Institutional",
      };

      setArtworksList((prev) => [newArtworkObj, ...prev]);

      const genesisEvent: MockProvenanceEvent = {
        eventType: EventType.Minted,
        actor: user.address as `0x${string}`,
        actorRole: `${user.role} (${user.name})`,
        timestamp: BigInt(Math.floor(Date.now() / 1000)),
        description: `Genesis minting and cryptographic SHA-256 seal anchored to Ethereum ledger.`,
        location: "Geneva Archival Vault",
      };

      setProvenanceEvents((prev) => ({
        ...prev,
        [nextTokenId]: [genesisEvent],
      }));

      toast.success(
        `Masterpiece "${newTitle}" successfully sealed onto Ethereum (Token #${nextTokenId})!`
      );

      // Reset form
      setNewTitle("");
      setNewFile(null);
      setNewFilePreview(null);
      setNewComputedHash("");
      setNewDescription("");

      // Switch to portfolio tab to view the newly minted item
      setActiveTab("portfolio");
    } catch {
      toast.error("Failed to mint masterpiece");
    } finally {
      setIsMintingOnChain(false);
    }
  };

  // In-modal event logging handler
  const handleModalLogEvent = (type: EventType, roleLabel: string) => {
    if (inspectArtworkId === null) return;
    if (!modalActionDescription.trim()) {
      toast.error("Please enter event description / curatorial notes");
      return;
    }

    const newEvent: MockProvenanceEvent = {
      eventType: type,
      actor: user.address as `0x${string}`,
      actorRole: `${user.role} (${user.name})`,
      timestamp: BigInt(Math.floor(Date.now() / 1000)),
      description: modalActionDescription.trim(),
      location: modalActionLocation.trim() || "International Cultural Exchange",
    };

    setProvenanceEvents((prev) => ({
      ...prev,
      [inspectArtworkId]: [...(prev[inspectArtworkId] || []), newEvent],
    }));

    setArtworksList((prev) =>
      prev.map((a) =>
        a.tokenId === inspectArtworkId ? { ...a, eventsCount: a.eventsCount + 1 } : a
      )
    );

    setModalActionDescription("");
    setModalActionLocation("");
    toast.success(`Cryptographic ${roleLabel} event recorded to token #${inspectArtworkId}!`);
  };

  // Forensic Verifier file handler
  const handleVerifyFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVerifyFile(file);
    setVerifyFilePreview(URL.createObjectURL(file));
    setIsVerifyingHash(true);
    try {
      const hash = await computeSHA256(file);
      setVerifyComputedHash(hash);
      toast.success("Cryptographic SHA-256 fingerprint generated!");
    } catch (err: any) {
      toast.error("Failed to generate file hash: " + (err.message || "Unknown error"));
    } finally {
      setIsVerifyingHash(false);
    }
  };

  const loadAuthenticSample = () => {
    setVerifyComputedHash(selectedVerifyArtwork.imageHash);
    toast.success(`Authentic hash loaded for Token #${selectedVerifyArtwork.tokenId}`);
  };

  const loadCounterfeitSample = () => {
    const altered = selectedVerifyArtwork.imageHash.slice(0, -6) + "00beef";
    setVerifyComputedHash(altered);
    toast.warning("Altered / non-matching test hash loaded");
  };

  // Recent Provenance Knowledge Table data
  const ledgerKnowledgeItems = [
    {
      subject: "Genesis SHA-256 Digest Sealing",
      status: "Executed",
      statusStyle: "border-[#49C98A]/30 bg-[#49C98A]/10 text-[#1a7e4e]",
      startDate: "2026-10-06 09:12",
      assignedNode: "Aria Thorne (Artist)",
      artwork: "Salvator Mundi",
    },
    {
      subject: "Exhibition Custody Loan Transfer",
      status: "Active",
      statusStyle: "border-[#F07BAF]/30 bg-[#F07BAF]/10 text-[#a8245e]",
      startDate: "2026-10-05 14:30",
      assignedNode: "Galerie Louvre (Gallery)",
      artwork: "Girl with a Pearl Earring",
    },
    {
      subject: "Multi-Spectrum Reflectography Scan",
      status: "Executed",
      statusStyle: "border-[#49C98A]/30 bg-[#49C98A]/10 text-[#1a7e4e]",
      startDate: "2026-10-04 11:20",
      assignedNode: "Dr. Julian Croft (Restorer)",
      artwork: "The Starry Night",
    },
    {
      subject: "Market Valuation & Insurance Underwrite",
      status: "Scheduled",
      statusStyle: "border-[#F5A623]/30 bg-[#F5A623]/10 text-[#a86500]",
      startDate: "2026-10-07 10:00",
      assignedNode: "Sotheby's Heritage (Appraiser)",
      artwork: "The Kiss (Der Kuss)",
    },
    {
      subject: "Macroscopic XRF Pigment Mapping",
      status: "Executed",
      statusStyle: "border-[#49C98A]/30 bg-[#49C98A]/10 text-[#1a7e4e]",
      startDate: "2026-10-03 16:40",
      assignedNode: "Rijksmuseum Lab (Restorer)",
      artwork: "The Night Watch",
    },
  ];

  // Recharts Chart Data
  const chartData = [
    { name: "Executed Proofs", value: 8, color: "#49C98A" },
    { name: "Active Loans", value: 4, color: "#F07BAF" },
    { name: "Scheduled Valuations", value: 3, color: "#DBBA95" },
  ];

  // Filter artworks by search and medium
  const filteredArtworks = artworksList.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tokenId.toString() === searchQuery.trim() ||
      art.imageHash.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMedium =
      selectedMediumFilter === "All" ||
      (selectedMediumFilter === "Oil" && art.medium.includes("Oil")) ||
      (selectedMediumFilter === "Bronze" && art.medium.includes("Bronze")) ||
      (selectedMediumFilter === "Tempera" && art.medium.includes("Tempera")) ||
      (selectedMediumFilter === "Drawing" && art.medium.includes("Chalk"));

    return matchesSearch && matchesMedium;
  });

  return (
    <div className="min-h-screen bg-[#F7F3F0] text-[#242633] flex font-sans select-none antialiased">
      {/* =========================================================================
          1. EXPANDABLE & COLLAPSIBLE LEFT SIDEBAR NAVIGATION
      ========================================================================= */}
      <aside
        className={`h-screen sticky top-0 z-40 glass-panel border-r border-[#EEE8E3] flex flex-col justify-between transition-all duration-300 shrink-0 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Top: Brand Header & Collapse Toggle */}
        <div className="p-4 border-b border-[#EEE8E3]/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl brand-gradient text-[#242633] flex items-center justify-center font-black shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-base text-[#242633] tracking-tight truncate leading-none">
                  ArtLedger
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#686878] font-bold mt-0.5 truncate">
                  Curator Suite
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white border border-[#EEE8E3] flex items-center justify-center text-[#686878] hover:text-[#242633] transition-colors shadow-2xs cursor-pointer shrink-0"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Center: Navigation Menu Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {/* Item 1: Provenance Journey */}
          <button
            type="button"
            onClick={() => handleTabSelect("journey")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "journey"
                ? "nav-pill-active shadow-xs"
                : "text-[#686878] hover:text-[#242633] hover:bg-white/80"
            } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
            title="Provenance Journeys"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span className="truncate">Provenance Journey</span>}
          </button>

          {/* Item 2: My Role Studio */}
          <button
            type="button"
            onClick={() => handleTabSelect("role-tools")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "role-tools"
                ? "nav-pill-active shadow-xs"
                : "text-[#686878] hover:text-[#242633] hover:bg-white/80"
            } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
            title={`${user.role} Studio`}
          >
            {user.role === "Artist" && <Palette className="w-4 h-4 text-[#F07BAF] shrink-0" />}
            {user.role === "Gallery" && <Landmark className="w-4 h-4 text-[#DBBA95] shrink-0" />}
            {user.role === "Restorer" && <Hammer className="w-4 h-4 text-[#49C98A] shrink-0" />}
            {user.role === "Appraiser" && (
              <BadgeDollarSign className="w-4 h-4 text-[#F5A623] shrink-0" />
            )}
            {user.role === "Admin" && <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />}
            {!isSidebarCollapsed && (
              <span className="truncate">My Studio ({user.role})</span>
            )}
          </button>

          {/* Item 3: Register Masterpiece (Restricted to Artist / Admin) */}
          <button
            type="button"
            onClick={() => handleTabSelect("register")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              canRegister
                ? activeTab === "register"
                  ? "nav-pill-active shadow-xs cursor-pointer"
                  : "text-[#686878] hover:text-[#242633] hover:bg-white/80 cursor-pointer"
                : "opacity-45 text-[#9898a0] bg-transparent cursor-not-allowed"
            } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
            title={
              canRegister
                ? "Register New Masterpiece"
                : "Register Masterpiece (Exclusive to Artist & Admin)"
            }
          >
            <div className="flex items-center gap-3 min-w-0">
              <PlusCircle className="w-4 h-4 shrink-0 text-[#DBBA95]" />
              {!isSidebarCollapsed && (
                <span className="truncate">Register Masterpiece</span>
              )}
            </div>
            {!isSidebarCollapsed && !canRegister && (
              <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-stone-200/80 text-stone-600">
                <Lock className="w-2.5 h-2.5" />
                <span>Artist</span>
              </span>
            )}
          </button>

          {/* Item 4: Masterpieces Registry */}
          <button
            type="button"
            onClick={() => handleTabSelect("portfolio")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "portfolio"
                ? "nav-pill-active shadow-xs"
                : "text-[#686878] hover:text-[#242633] hover:bg-white/80"
            } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
            title="Masterpieces Registry"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Star className="w-4 h-4 shrink-0 text-[#F07BAF]" />
              {!isSidebarCollapsed && (
                <span className="truncate">Masterpieces Registry</span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <span className="text-[10px] font-mono font-bold text-[#686878] bg-white/70 px-1.5 py-0.5 rounded-full border border-[#EEE8E3]">
                {artworksList.length}
              </span>
            )}
          </button>

          {/* Item 5: Forensic Verifier */}
          <button
            type="button"
            onClick={() => handleTabSelect("verifications")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "verifications"
                ? "nav-pill-active shadow-xs"
                : "text-[#686878] hover:text-[#242633] hover:bg-white/80"
            } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
            title="Forensic SHA-256 Verifier"
          >
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#49C98A]" />
            {!isSidebarCollapsed && <span className="truncate">Forensic Verifier</span>}
          </button>

          {/* Item 6: Audit Trail */}
          <button
            type="button"
            onClick={() => handleTabSelect("history")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "history"
                ? "nav-pill-active shadow-xs"
                : "text-[#686878] hover:text-[#242633] hover:bg-white/80"
            } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
            title="Decentralized Audit Trail"
          >
            <Database className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span className="truncate">Audit Trail</span>}
          </button>

          {/* Item 7: Admin Protocol Governance (Restricted to Admin) */}
          <button
            type="button"
            onClick={() => handleTabSelect("governance")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              canAccessGovernance
                ? activeTab === "governance"
                  ? "nav-pill-active shadow-xs cursor-pointer"
                  : "text-[#686878] hover:text-[#242633] hover:bg-white/80 cursor-pointer"
                : "opacity-45 text-[#9898a0] bg-transparent cursor-not-allowed"
            } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
            title={
              canAccessGovernance
                ? "Admin Protocol Governance"
                : "Admin Governance (Exclusive to Admin)"
            }
          >
            <div className="flex items-center gap-3 min-w-0">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
              {!isSidebarCollapsed && (
                <span className="truncate">Admin Governance</span>
              )}
            </div>
            {!isSidebarCollapsed && !canAccessGovernance && (
              <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-stone-200/80 text-stone-600">
                <Lock className="w-2.5 h-2.5" />
                <span>Admin</span>
              </span>
            )}
          </button>
        </div>

        {/* Bottom: Profile Trigger Button */}
        <div className="p-3 border-t border-[#EEE8E3]/80">
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className={`w-full p-2 rounded-2xl bg-white/70 hover:bg-white border border-[#EEE8E3] flex items-center gap-2.5 transition-all text-left shadow-2xs group cursor-pointer ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
            title="User Profile & Settings"
          >
            <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#DBBA95] via-[#FABED7] to-[#F07BAF] shrink-0">
              <div className="w-8 h-8 rounded-full bg-white text-[#242633] font-black flex items-center justify-center text-xs relative">
                {user.name.charAt(0)}
                <span className="w-2.5 h-2.5 rounded-full bg-[#49C98A] ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
              </div>
            </div>

            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-xs text-[#242633] truncate leading-tight group-hover:text-[#F07BAF] transition-colors">
                  {user.name}
                </p>
                <p className="text-[10px] text-[#855e30] font-semibold truncate leading-none mt-0.5">
                  {user.role} Node
                </p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* =========================================================================
          2. MAIN WORKSPACE / CONTENT AREA
      ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Workspace Top Utility Header */}
        <header className="px-6 py-3.5 border-b border-[#EEE8E3] glass-panel-subtle flex items-center justify-between gap-4 sticky top-0 z-30">
          {/* Quick Breadcrumb / Active Console Title */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#686878]">
              ArtLedger Console
            </span>
            <span className="text-xs text-[#686878]">/</span>
            <span className="text-xs font-black text-[#242633] capitalize">
              {activeTab === "journey" && "Provenance Journey"}
              {activeTab === "role-tools" && `${user.role} Dedicated Studio`}
              {activeTab === "register" && "Genesis Masterpiece Registration"}
              {activeTab === "portfolio" && "Masterpieces Registry"}
              {activeTab === "verifications" && "Forensic Cryptographic Verifier"}
              {activeTab === "history" && "Decentralized Audit Trail"}
              {activeTab === "governance" && "Smart Contract Governance"}
            </span>
          </div>

          {/* Quick Tools: Search, Node Pill, Profile Button */}
          <div className="flex items-center gap-3">
            {/* Quick Registry Search */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search token #, artist, hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 pl-8 pr-3 py-1.5 text-xs rounded-full bg-white/80 border border-[#EEE8E3] focus:outline-none focus:ring-2 focus:ring-[#FABED7]/40 focus:border-[#F07BAF] font-medium text-[#242633] placeholder:text-[#686878]"
              />
              <Search className="w-3.5 h-3.5 text-[#686878] absolute left-3 top-2.5" />
            </div>

            {/* Hardhat / Ethereum Node Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-[#EEE8E3] text-[11px] font-bold text-[#434553]">
              <span className="w-2 h-2 rounded-full bg-[#49C98A] animate-pulse" />
              <span>Node #31337</span>
            </div>

            {/* Profile Avatar Pill in Header (Opens Profile Popover) */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white/80 hover:bg-white border border-[#EEE8E3] transition-all text-xs shadow-2xs cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full brand-gradient text-[#242633] font-bold text-[10px] flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
              <span className="font-bold text-[#242633]">{user.role}</span>
            </button>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <AnimatePresence mode="wait">
            {/* =========================================================================
                TAB 1: PROVENANCE JOURNEYS (CLUTTER-FREE)
            ========================================================================= */}
            {activeTab === "journey" && (
              <motion.div
                key="journey"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-[1500px] mx-auto"
              >
                {/* Clean Top Banner: Clutter Removed (No avatars strip, no quick button row) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-[#EEE8E3]/60">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242633] tracking-tight">
                      Provenance Journeys
                    </h1>
                    <p className="text-xs text-[#686878] font-medium mt-0.5">
                      End-to-end cryptographic lifecycle orchestration across decentralized curator nodes
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full font-bold border border-[#49C98A]/30 bg-[#49C98A]/10 px-3.5 py-1 text-xs text-[#1a7e4e] self-start sm:self-auto">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#49C98A] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#49C98A]"></span>
                    </span>
                    Ledger State: Verified Immutable
                  </span>
                </div>

                {/* Connected Multi-Stage Journey Pipeline */}
                <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#686878]">
                        Active Provenance Pipeline
                      </span>
                      <h2 className="text-lg font-black text-[#242633]">
                        Artwork Lifecycle Management (Token #0: Salvator Mundi)
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInspectArtworkId(0)}
                      className="px-3 py-1.5 rounded-2xl bg-white hover:bg-[#F7F3F0] border border-[#EEE8E3] text-xs font-bold text-[#F07BAF] transition-all cursor-pointer shadow-xs"
                    >
                      View Full Token Timeline →
                    </button>
                  </div>

                  {/* The 4 Journey Columns Connected Horizontally */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                    {/* Stage 1: Genesis Intake */}
                    <div className="p-4 rounded-2xl bg-white/80 border border-[#EEE8E3] shadow-xs flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[#EEE8E3]">
                          <span className="text-[11px] font-bold text-[#242633]">Genesis Intake</span>
                          <Check className="w-3.5 h-3.5 text-[#49C98A]" />
                        </div>
                        <div className="p-3 rounded-xl bg-[#F7F3F0]/60 border border-[#EEE8E3] space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full brand-gradient text-[#242633] font-bold text-xs flex items-center justify-center">
                              A
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#242633]">Allocate Piece to Artist</p>
                              <p className="text-[10px] text-[#686878]">Leonardo da Vinci Studio</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-[#F7F3F0]/60 border border-[#EEE8E3] space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-white border border-[#EEE8E3] text-[#242633] font-bold text-xs flex items-center justify-center">
                              #0
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#242633]">Acknowledge SHA-256 Digest</p>
                              <p className="text-[10px] text-[#686878]">0x7eb6...824b</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 text-center text-[10px] font-extrabold uppercase tracking-wider text-[#686878] border-t border-[#EEE8E3]">
                        Stage 1: Intake & Minting
                      </div>
                    </div>

                    {/* Stage 2: Forensic Inspection */}
                    <div className="p-4 rounded-2xl bg-white/80 border border-[#EEE8E3] shadow-xs flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[#EEE8E3]">
                          <span className="text-[11px] font-bold text-[#242633]">Forensic Inspection</span>
                          <Check className="w-3.5 h-3.5 text-[#49C98A]" />
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#F7F3F0]/60 border border-[#EEE8E3] flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#49C98A]/15 text-[#1a7e4e] font-bold text-[10px] flex items-center justify-center">
                            J
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#242633] truncate">Identify Condition Grade</p>
                            <p className="text-[10px] text-[#686878]">Pristine Stabilization</p>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#F7F3F0]/60 border border-[#EEE8E3] flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#49C98A]/15 text-[#1a7e4e] font-bold text-[10px] flex items-center justify-center">
                            J
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#242633] truncate">Pigment Reflectography</p>
                            <p className="text-[10px] text-[#686878]">Infrared & UV Analysis</p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 text-center text-[10px] font-extrabold uppercase tracking-wider text-[#686878] border-t border-[#EEE8E3]">
                        Stage 2: Diagnostics
                      </div>
                    </div>

                    {/* Stage 3: Custody & Conservation */}
                    <div className="p-4 rounded-2xl bg-white/80 border border-[#EEE8E3] shadow-xs flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[#EEE8E3]">
                          <span className="text-[11px] font-bold text-[#242633]">Custodial Care</span>
                          <Check className="w-3.5 h-3.5 text-[#49C98A]" />
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#F7F3F0]/60 border border-[#EEE8E3] flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full brand-gradient text-[#242633] font-bold text-[10px] flex items-center justify-center">
                            +
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#242633] truncate">Museum Exhibition Loan</p>
                            <p className="text-[10px] text-[#686878]">National Gallery London</p>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#F7F3F0]/60 border border-[#EEE8E3] flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#49C98A]/15 text-[#1a7e4e] font-bold text-[10px] flex items-center justify-center">
                            J
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#242633] truncate">Varnish Stabilization</p>
                            <p className="text-[10px] text-[#686878]">Chemical Treatment Logged</p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 text-center text-[10px] font-extrabold uppercase tracking-wider text-[#686878] border-t border-[#EEE8E3]">
                        Stage 3: Custody & Care
                      </div>
                    </div>

                    {/* Stage 4: Valuation & Certification */}
                    <div className="p-4 rounded-2xl bg-white/80 border border-[#EEE8E3] shadow-xs flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between pb-1">
                          <span className="text-[11px] font-bold text-[#242633]">Valuation & Underwrite</span>
                          <span className="text-[10px] font-mono text-[#F07BAF] font-bold">Stage 4</span>
                        </div>
                        <div className="p-4 rounded-2xl brand-gradient text-[#242633] shadow-md space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#242633]/80">
                              Active Processing
                            </span>
                            <Sparkles className="w-3.5 h-3.5 text-[#242633]" />
                          </div>
                          <h4 className="font-extrabold text-sm text-[#242633]">Certified Valuation $450M</h4>
                          <p className="text-[10px] text-[#242633]/80">Christie&apos;s New York Official Appraisal</p>
                        </div>
                      </div>
                      <div className="pt-2 text-center text-[10px] font-extrabold uppercase tracking-wider text-[#686878] border-t border-[#EEE8E3]">
                        Stage 4: Certification
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytical Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Recent Ledger Knowledge Table (8 Cols) */}
                  <div className="lg:col-span-8 p-6 rounded-3xl glass-panel space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-black text-[#242633]">
                          Ledger Provenance History & Knowledge
                        </h3>
                        <p className="text-xs text-[#686878] font-medium">
                          Audited cryptographic events across verified institutional nodes
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.info("Syncing with Ethereum node...")}
                        className="p-2 rounded-xl bg-white hover:bg-[#F7F3F0] border border-[#EEE8E3] text-[#686878] hover:text-[#242633] transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#F7F3F0]/60 text-[#686878] font-bold text-[11px] border-b border-[#EEE8E3]">
                          <tr>
                            <th className="py-2.5 px-3">Subject</th>
                            <th className="py-2.5 px-3">Artwork</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3">Date</th>
                            <th className="py-2.5 px-3">Assigned Node</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EEE8E3]/60">
                          {ledgerKnowledgeItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-white/60 transition-colors">
                              <td className="py-3 px-3 font-bold text-[#242633]">{item.subject}</td>
                              <td className="py-3 px-3 text-[#434553] font-medium">{item.artwork}</td>
                              <td className="py-3 px-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${item.statusStyle}`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-[#686878] font-mono text-[11px]">{item.startDate}</td>
                              <td className="py-3 px-3 text-[#242633] font-medium">{item.assignedNode}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right: Ledger Journey Metrics (4 Cols) */}
                  <div className="lg:col-span-4 p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#242633]">Ledger Journey Metrics</h3>
                      <p className="text-xs text-[#686878] font-medium">
                        Cryptographic protocol execution distribution
                      </p>
                    </div>

                    <div className="py-2 flex items-center justify-center">
                      <div className="relative w-48 h-48 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={75}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                background: "rgba(255, 255, 255, 0.95)",
                                borderRadius: "16px",
                                border: "1px solid #EEE8E3",
                                fontSize: "11px",
                                fontWeight: "bold",
                                color: "#242633",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center pointer-events-none">
                          <span className="text-2xl font-black text-[#242633]">15</span>
                          <span className="text-[9px] uppercase font-bold text-[#686878]">Total Proofs</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#EEE8E3]">
                      <div className="p-2 rounded-2xl bg-[#49C98A]/10 border border-[#49C98A]/30 text-center">
                        <span className="text-base font-black text-[#1a7e4e] block">8</span>
                        <span className="text-[10px] font-bold text-[#1a7e4e]">Executed</span>
                      </div>
                      <div className="p-2 rounded-2xl bg-[#F07BAF]/10 border border-[#F07BAF]/30 text-center">
                        <span className="text-base font-black text-[#a8245e] block">4</span>
                        <span className="text-[10px] font-bold text-[#a8245e]">Active</span>
                      </div>
                      <div className="p-2 rounded-2xl bg-[#DBBA95]/15 border border-[#DBBA95]/40 text-center">
                        <span className="text-base font-black text-[#855e30] block">3</span>
                        <span className="text-[10px] font-bold text-[#855e30]">Scheduled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* =========================================================================
                TAB 2: ROLE-SPECIFIC STUDIO (CLEAN: SWITCH ROLE HEADER REMOVED)
            ========================================================================= */}
            {activeTab === "role-tools" && (
              <motion.div
                key="role-tools"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-[1500px] mx-auto"
              >
                {/* Clean Header: Role Switcher Bar Completely Removed as requested */}
                <div className="pb-2 border-b border-[#EEE8E3]/60">
                  <h2 className="text-2xl font-black text-[#242633]">
                    {user.role} Dedicated Workspace
                  </h2>
                  <p className="text-xs text-[#686878]">
                    Specialized on-chain actions authorized exclusively for your credential:{" "}
                    <strong>{ROLE_DEFAULTS[user.role].title}</strong>
                  </p>
                </div>

                {/* Dynamically render dedicated role console with interactive in-dashboard callbacks */}
                {user.role === "Artist" && (
                  <ArtistDashboardView
                    onOpenRegister={() => setActiveTab("register")}
                    onOpenTimeline={(id) => setInspectArtworkId(id)}
                    onOpenPortfolio={() => setActiveTab("portfolio")}
                  />
                )}
                {user.role === "Gallery" && (
                  <GalleryDashboardView
                    onOpenTimeline={(id) => setInspectArtworkId(id)}
                    onOpenPortfolio={() => setActiveTab("portfolio")}
                    onLogCustodyAction={(tokenId, actionType) => {
                      setInspectArtworkId(tokenId);
                      setModalActionDescription(`Official Gallery Custody Action: ${actionType}`);
                    }}
                  />
                )}
                {user.role === "Restorer" && (
                  <RestorerDashboardView
                    onOpenVerifier={() => setActiveTab("verifications")}
                    onOpenTimeline={(id) => setInspectArtworkId(id)}
                    onOpenPortfolio={() => setActiveTab("portfolio")}
                    onLogRestorationAction={(tokenId, treatmentType) => {
                      setInspectArtworkId(tokenId);
                      setModalActionDescription(`Scientific Restoration Treatment: ${treatmentType}`);
                    }}
                  />
                )}
                {user.role === "Appraiser" && (
                  <AppraiserDashboardView
                    onOpenVerifier={() => setActiveTab("verifications")}
                    onOpenTimeline={(id) => setInspectArtworkId(id)}
                    onOpenPortfolio={() => setActiveTab("portfolio")}
                    onLogAppraisalAction={(tokenId, amount) => {
                      setInspectArtworkId(tokenId);
                      setModalActionDescription(`Certified Institutional Valuation Attestation: ${amount}`);
                    }}
                  />
                )}
                {user.role === "Admin" && (
                  <AdminDashboardView
                    onOpenVerifier={() => setActiveTab("verifications")}
                    onOpenPortfolio={() => setActiveTab("portfolio")}
                    onOpenTimeline={(id) => setInspectArtworkId(id)}
                  />
                )}
              </motion.div>
            )}

            {/* =========================================================================
                TAB 3: IN-DASHBOARD REGISTER MASTERPIECE STUDIO
            ========================================================================= */}
            {activeTab === "register" && (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-4xl mx-auto py-2"
              >
                <div className="pb-2 border-b border-[#EEE8E3]">
                  <h2 className="text-2xl font-black text-[#242633] flex items-center gap-2">
                    <PlusCircle className="w-6 h-6 text-[#DBBA95]" />
                    <span>Genesis Masterpiece Registration Studio</span>
                  </h2>
                  <p className="text-xs text-[#686878]">
                    Bind physical artwork photographs to cryptographically immutable SHA-256 digests and mint an ERC-721 token on Ethereum.
                  </p>
                </div>

                <form onSubmit={handleExecuteMint} className="p-6 sm:p-8 rounded-3xl glass-panel space-y-6">
                  {/* Step 1: Metadata Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#242633]">
                        Artwork Title <span className="text-[#F07BAF]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. The Last Supper"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-white/80 border border-[#EEE8E3] focus:outline-none focus:ring-2 focus:ring-[#FABED7]/50 font-medium text-[#242633]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#242633]">
                        Artist Name <span className="text-[#F07BAF]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Leonardo da Vinci"
                        value={newArtist}
                        onChange={(e) => setNewArtist(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-white/80 border border-[#EEE8E3] focus:outline-none focus:ring-2 focus:ring-[#FABED7]/50 font-medium text-[#242633]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#242633]">Creation Year</label>
                      <input
                        type="number"
                        placeholder="1498"
                        value={newYear}
                        onChange={(e) => setNewYear(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-white/80 border border-[#EEE8E3] focus:outline-none focus:ring-2 focus:ring-[#FABED7]/50 font-medium text-[#242633]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#242633]">Medium / Technique</label>
                      <input
                        type="text"
                        placeholder="e.g. Tempera and Oil on Gesso"
                        value={newMedium}
                        onChange={(e) => setNewMedium(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-white/80 border border-[#EEE8E3] focus:outline-none focus:ring-2 focus:ring-[#FABED7]/50 font-medium text-[#242633]"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-[#242633]">Estimated Market Valuation (USD)</label>
                      <input
                        type="text"
                        placeholder="e.g. $25,000,000"
                        value={newValuation}
                        onChange={(e) => setNewValuation(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-white/80 border border-[#EEE8E3] focus:outline-none focus:ring-2 focus:ring-[#FABED7]/50 font-medium text-[#242633]"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-[#242633]">Curatorial Description</label>
                      <textarea
                        rows={3}
                        placeholder="Provide historical context, dimensions, substrate condition, and provenance notes..."
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-white/80 border border-[#EEE8E3] focus:outline-none focus:ring-2 focus:ring-[#FABED7]/50 font-medium text-[#242633]"
                      />
                    </div>
                  </div>

                  {/* Step 2: Image File & Client-side SHA-256 Computation */}
                  <div className="space-y-3 pt-2 border-t border-[#EEE8E3]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#242633]">
                        Physical Artwork High-Resolution Photograph <span className="text-[#F07BAF]">*</span>
                      </span>
                      <span className="text-[10px] text-[#686878]">Web Crypto SHA-256 Engine</span>
                    </div>

                    <label className="border-2 border-dashed border-[#EEE8E3] hover:border-[#F07BAF] hover:bg-white/60 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMintFileUpload}
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-2xl bg-white group-hover:scale-105 border border-[#EEE8E3] text-[#686878] group-hover:text-[#F07BAF] flex items-center justify-center mb-2 transition-all shadow-xs">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-[#242633]">
                        {newFile ? newFile.name : "Click to select or drag & drop high-res image"}
                      </span>
                      <span className="text-[10px] text-[#686878] mt-0.5">
                        High-resolution photography used for pixel-level SHA-256 digest sealing
                      </span>
                    </label>

                    {newComputedHash && (
                      <div className="p-3.5 rounded-2xl bg-white/90 border border-[#EEE8E3] space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-[#686878] uppercase font-bold tracking-wider">
                          <span>Computed Cryptographic Fingerprint:</span>
                          <span className="text-[#49C98A] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Ready to Mint
                          </span>
                        </div>
                        <p className="font-mono text-xs text-[#242633] break-all select-all font-semibold">
                          {newComputedHash}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab("portfolio")}
                      className="px-5 py-2.5 rounded-2xl border border-[#EEE8E3] bg-white hover:bg-[#F7F3F0] text-xs font-bold text-[#686878] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isMintingOnChain || isHashingMintFile || !newComputedHash}
                      className="px-6 py-2.5 rounded-2xl brand-gradient text-[#242633] font-black text-xs shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)] hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isMintingOnChain ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#242633] border-t-transparent rounded-full animate-spin" />
                          <span>Sealing on Ethereum Ledger...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-[#242633]" />
                          <span>Seal & Mint On-Chain</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* =========================================================================
                TAB 4: MASTERPIECES REGISTRY (FULL 12 WORKS, ZERO CROP)
            ========================================================================= */}
            {activeTab === "portfolio" && (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-[1500px] mx-auto"
              >
                {/* Header & Filter Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-[#242633]">
                      Masterpieces Collection Registry
                    </h2>
                    <p className="text-xs text-[#686878]">
                      {filteredArtworks.length} Registered museum-grade artworks with uncropped framing and immutable SHA-256 fingerprints
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Medium Filter Pills */}
                    <div className="flex items-center gap-1 bg-white/80 p-1 rounded-2xl border border-[#EEE8E3]">
                      {["All", "Oil", "Bronze", "Tempera", "Drawing"].map((medium) => (
                        <button
                          key={medium}
                          type="button"
                          onClick={() => setSelectedMediumFilter(medium)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selectedMediumFilter === medium
                              ? "nav-pill-active shadow-xs"
                              : "text-[#686878] hover:bg-[#F7F3F0] hover:text-[#242633]"
                          }`}
                        >
                          {medium}
                        </button>
                      ))}
                    </div>

                    {/* In-Dashboard Register Button */}
                    {canRegister && (
                      <button
                        type="button"
                        onClick={() => setActiveTab("register")}
                        className="px-4 py-2 rounded-2xl brand-gradient text-[#242633] text-xs font-extrabold flex items-center gap-1.5 shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)] hover:scale-[1.02] transition-all cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Register New Piece</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 12 Uncropped Artworks Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredArtworks.map((item) => (
                    <div
                      key={item.tokenId}
                      className="group rounded-3xl border border-[#EEE8E3] glass-panel overflow-hidden flex flex-col justify-between transition-all hover:shadow-md hover:border-[#FABED7]/80"
                    >
                      {/* Museum Uncropped Display Frame */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-[#F7F3F0] via-white to-[#F7F3F0] flex items-center justify-center p-3">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#242633] shadow-xs border border-[#EEE8E3]">
                          Token #{item.tokenId}
                        </div>
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#49C98A] text-white shadow-xs flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      </div>

                      {/* Info Body */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="font-bold text-sm text-[#242633] truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-[#686878] font-medium">
                            {item.artistName} ({item.year})
                          </p>
                        </div>

                        {/* Hash Card */}
                        <div className="p-2.5 rounded-xl bg-white/80 border border-[#EEE8E3] space-y-0.5">
                          <span className="text-[9px] uppercase font-bold text-[#686878] block">
                            SHA-256 Fingerprint
                          </span>
                          <span className="font-mono text-[10px] text-[#434553] block truncate">
                            {item.imageHash}
                          </span>
                        </div>

                        {/* Valuation & Inspection Trigger */}
                        <div className="pt-2 border-t border-[#EEE8E3] flex items-center justify-between text-xs">
                          <span className="text-[11px] font-bold text-[#1a7e4e]">
                            {item.valuation || "$10M+"}
                          </span>
                          <button
                            type="button"
                            onClick={() => setInspectArtworkId(item.tokenId)}
                            className="text-xs font-bold text-[#F07BAF] hover:text-[#242633] inline-flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>Inspect & Timeline</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* =========================================================================
                TAB 5: FORENSIC VERIFIER TOOL (IN-DASHBOARD COMPARATOR)
            ========================================================================= */}
            {activeTab === "verifications" && (
              <motion.div
                key="verifications"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-5xl mx-auto py-2"
              >
                <div className="pb-2 border-b border-[#EEE8E3]">
                  <h2 className="text-2xl font-black text-[#242633] flex items-center gap-2">
                    <FileSearch className="w-6 h-6 text-[#49C98A]" />
                    <span>Forensic Cryptographic Comparator</span>
                  </h2>
                  <p className="text-xs text-[#686878] font-medium">
                    Compute SHA-256 digests in real time and verify physical artwork authenticity against the ledger.
                  </p>
                </div>

                {/* Masterpiece Selection Chips */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#686878] block">
                    Select Registered Artwork to Inspect:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {artworksList.map((art) => {
                      const isSelected = verifyTokenId === art.tokenId;
                      return (
                        <button
                          key={art.tokenId}
                          type="button"
                          onClick={() => {
                            setVerifyTokenId(art.tokenId);
                            setVerifyComputedHash("");
                            setVerifyFile(null);
                            setVerifyFilePreview(null);
                          }}
                          className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? "nav-pill-active shadow-xs"
                              : "bg-white/80 border border-[#EEE8E3] text-[#434553] hover:bg-white"
                          }`}
                        >
                          <span className="font-mono text-[10px] opacity-70">#{art.tokenId}</span>
                          <span>{art.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Grid: Left Reference Artwork / Right Inspection Engine */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Card: Registered On-Chain Record (5 Cols) */}
                  <div className="md:col-span-5 p-5 rounded-3xl glass-panel space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[#EEE8E3]">
                      <span className="text-xs font-bold text-[#242633]">On-Chain Reference</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#DBBA95]/15 text-[#855e30] border border-[#DBBA95]/40">
                        Token #{selectedVerifyArtwork.tokenId}
                      </span>
                    </div>

                    <div className="aspect-[4/3] rounded-2xl bg-gradient-to-b from-[#F7F3F0] via-white to-[#F7F3F0] overflow-hidden relative border border-[#EEE8E3] flex items-center justify-center p-2">
                      <img
                        src={selectedVerifyArtwork.imageUrl}
                        alt={selectedVerifyArtwork.title}
                        className="max-h-full max-w-full object-contain drop-shadow-sm"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#49C98A] text-white shadow-xs flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Ledger Sealed</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-base text-[#242633] leading-snug">
                        {selectedVerifyArtwork.title}
                      </h4>
                      <p className="text-xs text-[#686878] font-medium">
                        {selectedVerifyArtwork.artistName} ({selectedVerifyArtwork.year}) • {selectedVerifyArtwork.medium}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/80 border border-[#EEE8E3] space-y-1">
                      <span className="text-[10px] uppercase font-extrabold text-[#686878] block tracking-wider">
                        Immutable On-Chain SHA-256 Digest
                      </span>
                      <span className="font-mono text-[11px] text-[#242633] block break-all font-semibold select-all">
                        {selectedVerifyArtwork.imageHash}
                      </span>
                    </div>
                  </div>

                  {/* Right Card: Drag & Drop Comparator (7 Cols) */}
                  <div className="md:col-span-7 p-6 rounded-3xl glass-panel space-y-5 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#242633]">Physical Asset Inspector</span>
                        <span className="text-[11px] text-[#686878]">Zero-Trust Client Cryptography</span>
                      </div>

                      {/* File Dropzone */}
                      <label className="border-2 border-dashed border-[#EEE8E3] hover:border-[#F07BAF] hover:bg-white/60 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleVerifyFile}
                          className="hidden"
                        />
                        <div className="w-12 h-12 rounded-2xl bg-white group-hover:scale-105 border border-[#EEE8E3] text-[#686878] group-hover:text-[#F07BAF] flex items-center justify-center mb-2 transition-all shadow-xs">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-[#242633]">
                          {verifyFile ? verifyFile.name : "Click to select or drag & drop high-res image"}
                        </span>
                        <span className="text-[10px] text-[#686878] mt-0.5">
                          JPEG, PNG, TIFF or WEBP (Computed client-side via Web Crypto API)
                        </span>
                      </label>

                      {/* Quick Demo Testing Shortcuts */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={loadAuthenticSample}
                          className="flex-1 px-3 py-2 rounded-2xl bg-[#49C98A]/10 hover:bg-[#49C98A]/20 border border-[#49C98A]/30 text-[#1a7e4e] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 text-[#49C98A]" />
                          <span>Load Authentic File Hash</span>
                        </button>

                        <button
                          type="button"
                          onClick={loadCounterfeitSample}
                          className="flex-1 px-3 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Simulate Counterfeit</span>
                        </button>
                      </div>

                      {/* Computed Hash Display */}
                      {verifyComputedHash && (
                        <div className="p-3.5 rounded-2xl bg-white/90 border border-[#EEE8E3] space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-[#686878] uppercase font-bold tracking-wider">
                            <span>Generated Physical Hash:</span>
                            <span className="text-[#F07BAF]">SHA-256</span>
                          </div>
                          <p className="font-mono text-xs text-[#242633] break-all select-all font-semibold">
                            {verifyComputedHash}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Verdict Card */}
                    {verifyComputedHash ? (
                      verifyComputedHash.toLowerCase() === selectedVerifyArtwork.imageHash.toLowerCase() ? (
                        <div className="p-4 rounded-2xl bg-[#49C98A]/10 border border-[#49C98A]/30 text-[#1a7e4e] space-y-2 animate-fade-in">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#49C98A] shrink-0" />
                            <h4 className="font-extrabold text-sm text-[#1a7e4e]">
                              AUTHENTIC MATCH CONFIRMED (100% Cryptographic Match)
                            </h4>
                          </div>
                          <p className="text-[11px] text-[#1a7e4e]/90 leading-relaxed">
                            The client-side SHA-256 fingerprint precisely matches the immutable on-chain record for Token #{selectedVerifyArtwork.tokenId} ({selectedVerifyArtwork.title}). Provenance integrity verified without alterations.
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2 animate-fade-in">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                            <h4 className="font-extrabold text-sm text-rose-900">
                              HASH MISMATCH DETECTED (Counterfeit or Modified File)
                            </h4>
                          </div>
                          <p className="text-[11px] text-rose-700 leading-relaxed">
                            Warning: The tested digital artifact does NOT match the genesis cryptographic hash anchored on the Ethereum ledger. This indicates a counterfeit copy, image manipulation, or altered resolution.
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="p-4 rounded-2xl bg-white/60 border border-[#EEE8E3] text-center text-xs text-[#686878] font-medium">
                        Upload an image or click &quot;Load Authentic File Hash&quot; above to run cryptographic comparison.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* =========================================================================
                TAB 6: ON-CHAIN ACTIVITY LOG (AUDIT TRAIL)
            ========================================================================= */}
            {activeTab === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-[1500px] mx-auto"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-[#242633]">
                      Decentralized Audit Trail
                    </h2>
                    <p className="text-xs text-[#686878]">
                      Live chronological events synchronized with Ethereum local node 31337
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-3xl glass-panel space-y-3">
                  {ledgerKnowledgeItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/80 border border-[#EEE8E3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-[#242633] flex items-center gap-2">
                          <span>{item.subject}</span>
                          <span className="text-[11px] font-semibold text-[#686878]">
                            ({item.artwork})
                          </span>
                        </div>
                        <p className="text-[11px] text-[#686878]">
                          Actor: <strong className="text-[#242633]">{item.assignedNode}</strong> • Timestamp: {item.startDate}
                        </p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${item.statusStyle} shrink-0`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* =========================================================================
                TAB 7: ADMIN PROTOCOL GOVERNANCE
            ========================================================================= */}
            {activeTab === "governance" && (
              <motion.div
                key="governance"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-[1500px] mx-auto"
              >
                <AdminDashboardView
                  onOpenVerifier={() => setActiveTab("verifications")}
                  onOpenPortfolio={() => setActiveTab("portfolio")}
                  onOpenTimeline={(id) => setInspectArtworkId(id)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* =========================================================================
          3. USER PROFILE & SETTINGS MODAL / POPOVER
      ========================================================================= */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/35 backdrop-blur-xs"
              onClick={() => setIsProfileModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative w-full max-w-md rounded-3xl glass-modal border border-white/80 shadow-2xl p-6 space-y-5 z-50"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-[#EEE8E3] flex items-center justify-center text-[#686878] hover:text-[#242633] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Profile Card Header */}
              <div className="flex items-center gap-3.5 pr-8">
                <div className="p-[3px] rounded-full bg-gradient-to-tr from-[#DBBA95] via-[#FABED7] to-[#F07BAF] shrink-0">
                  <div className="w-12 h-12 rounded-full bg-white text-[#242633] font-black flex items-center justify-center text-lg relative">
                    {user.name.charAt(0)}
                    <span className="w-3 h-3 rounded-full bg-[#49C98A] ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-base text-[#242633] truncate">
                    {user.name}
                  </h3>
                  <p className="text-xs text-[#686878] truncate">{user.email}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#DBBA95]/20 text-[#855e30] border border-[#DBBA95]/40">
                    {user.role} Verified Node
                  </span>
                </div>
              </div>

              {/* Wallet Address & Simulated Testnet Balance */}
              <div className="p-3.5 rounded-2xl bg-white/90 border border-[#EEE8E3] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#686878] font-semibold">Wallet Address:</span>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#242633]">
                    <span>{truncateAddress(user.address)}</span>
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="p-1 rounded-md hover:bg-stone-100 text-[#686878] hover:text-[#242633] transition-colors cursor-pointer"
                      title="Copy Address"
                    >
                      {copiedAddress ? (
                        <Check className="w-3.5 h-3.5 text-[#49C98A]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-[#EEE8E3]/60">
                  <span className="text-[#686878] font-semibold">Local Node Balance:</span>
                  <span className="font-black text-[#1a7e4e]">9.85 ETH (Hardhat Testnet)</span>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-[#EEE8E3]/60">
                  <span className="text-[#686878] font-semibold">Node Synchronization:</span>
                  <span className="font-bold text-[#242633] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#49C98A]" />
                    <span>Hardhat #31337 Synced</span>
                  </span>
                </div>
              </div>

              {/* Role Permissions Summary */}
              <div className="p-3.5 rounded-2xl bg-white/70 border border-[#EEE8E3] space-y-1.5 text-[11px]">
                <p className="font-bold text-[#242633]">Permissions for {user.role}:</p>
                <p className="text-[#686878] leading-relaxed">
                  {user.role === "Artist" &&
                    "Authorized to mint original genesis masterpieces and anchor SHA-256 digests onto Ethereum."}
                  {user.role === "Gallery" &&
                    "Authorized to log secondary acquisitions, museum exhibition agreements, and vault transfers."}
                  {user.role === "Restorer" &&
                    "Authorized to perform zero-trust condition scans and append chemical treatment reports."}
                  {user.role === "Appraiser" &&
                    "Authorized to issue official USD market valuations, condition grades, and insurance certificates."}
                  {user.role === "Admin" &&
                    "Full protocol oversight: grant and revoke role credentials, inspect all node transactions."}
                </p>
              </div>

              {/* At the Bottom: Single 'Switch Role' Option */}
              <div className="space-y-2 pt-1 border-t border-[#EEE8E3]">
                <button
                  type="button"
                  onClick={() => setIsSwitchRoleExpanded(!isSwitchRoleExpanded)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white/90 hover:bg-white border border-[#EEE8E3] text-xs font-bold text-[#242633] flex items-center justify-between transition-colors shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-[#F07BAF]" />
                    <span>Switch Role</span>
                  </div>
                  {isSwitchRoleExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#686878]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#686878]" />
                  )}
                </button>

                {isSwitchRoleExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-2 rounded-2xl bg-white/80 border border-[#EEE8E3] space-y-1"
                  >
                    {(["Artist", "Gallery", "Restorer", "Appraiser", "Admin"] as UserRole[]).map(
                      (roleOption) => {
                        const isCurrent = user.role === roleOption;
                        return (
                          <button
                            key={roleOption}
                            type="button"
                            onClick={() => {
                              switchRole(roleOption);
                              setIsProfileModalOpen(false);
                              setIsSwitchRoleExpanded(false);
                            }}
                            className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-colors cursor-pointer ${
                              isCurrent
                                ? "nav-pill-active shadow-xs"
                                : "text-[#434553] hover:bg-[#F7F3F0]"
                            }`}
                          >
                            <span>{roleOption} Console</span>
                            {isCurrent && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#242633]" />
                            )}
                          </button>
                        );
                      }
                    )}
                  </motion.div>
                )}

                {/* DEDICATED SIGN OUT BUTTON (Redirects to landing page) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    logout();
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                  title="Sign out and return to landing page"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          4. IN-DASHBOARD ARTWORK DETAILS & TIMELINE MODAL
      ========================================================================= */}
      <AnimatePresence>
        {inspectedArtwork && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setInspectArtworkId(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl glass-modal border border-white/80 shadow-2xl p-6 sm:p-8 z-50 space-y-6"
            >
              {/* Modal Close Button */}
              <button
                type="button"
                onClick={() => setInspectArtworkId(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-[#EEE8E3] flex items-center justify-center text-[#686878] hover:text-[#242633] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Artwork Summary Header */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left: Museum Frame Display */}
                <div className="md:col-span-5 aspect-[4/3] rounded-2xl bg-gradient-to-b from-[#F7F3F0] via-white to-[#F7F3F0] border border-[#EEE8E3] overflow-hidden flex items-center justify-center p-3 relative">
                  <img
                    src={inspectedArtwork.imageUrl}
                    alt={inspectedArtwork.title}
                    className="max-h-full max-w-full object-contain drop-shadow-sm"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#242633] shadow-xs border border-[#EEE8E3]">
                    Token #{inspectedArtwork.tokenId}
                  </div>
                </div>

                {/* Right: Specs & Valuations */}
                <div className="md:col-span-7 space-y-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#242633]">
                      {inspectedArtwork.title}
                    </h3>
                    <p className="text-xs text-[#686878] font-bold">
                      By {inspectedArtwork.artistName} ({inspectedArtwork.year}) • {inspectedArtwork.medium}
                    </p>
                  </div>

                  <p className="text-xs text-[#434553] leading-relaxed">
                    {inspectedArtwork.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/80 border border-[#EEE8E3]">
                      <span className="text-[10px] text-[#686878] font-bold block uppercase">
                        Certified Valuation
                      </span>
                      <span className="font-black text-[#1a7e4e]">
                        {inspectedArtwork.valuation || "$100M+ Priceless"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/80 border border-[#EEE8E3]">
                      <span className="text-[10px] text-[#686878] font-bold block uppercase">
                        Condition Rating
                      </span>
                      <span className="font-bold text-[#855e30]">
                        {inspectedArtwork.conditionRating || "Museum Archival (Grade A)"}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/80 border border-[#EEE8E3] space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-[#686878] block">
                      SHA-256 On-Chain Seal
                    </span>
                    <span className="font-mono text-[10px] text-[#242633] break-all select-all font-semibold block">
                      {inspectedArtwork.imageHash}
                    </span>
                  </div>
                </div>
              </div>

              {/* Provenance Event Timeline */}
              <div className="space-y-3 pt-3 border-t border-[#EEE8E3]">
                <h4 className="font-extrabold text-sm text-[#242633] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#F07BAF]" />
                  <span>On-Chain Provenance Journey Log</span>
                </h4>

                <div className="space-y-2.5">
                  {(provenanceEvents[inspectedArtwork.tokenId] || []).map((ev, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white/80 border border-[#EEE8E3] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-[#242633]">{ev.description}</p>
                        <p className="text-[11px] text-[#686878]">
                          Actor: <strong>{ev.actorRole}</strong> ({truncateAddress(ev.actor)}) • Location: {ev.location}
                        </p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#49C98A]/10 border border-[#49C98A]/30 text-[#1a7e4e] shrink-0">
                        Block Confirmed
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* In-Modal Quick Action for Authorized Roles */}
              <div className="p-4 rounded-2xl bg-white/80 border border-[#EEE8E3] space-y-3">
                <span className="text-xs font-bold text-[#242633] block">
                  Log New Action as <strong>{user.role}</strong> on Token #{inspectedArtwork.tokenId}:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Event Description (e.g. Loan to Louvre or Varnish Treatment)"
                    value={modalActionDescription}
                    onChange={(e) => setModalActionDescription(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#EEE8E3] text-xs text-[#242633]"
                  />
                  <input
                    type="text"
                    placeholder="Location / Venue (e.g. Paris, France)"
                    value={modalActionLocation}
                    onChange={(e) => setModalActionLocation(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#EEE8E3] text-xs text-[#242633]"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  {user.role === "Gallery" && (
                    <button
                      type="button"
                      onClick={() => handleModalLogEvent(EventType.CustodyTransfer, "Custody Transfer")}
                      className="px-4 py-2 rounded-xl brand-gradient text-[#242633] text-xs font-bold shadow-xs hover:scale-[1.02] cursor-pointer"
                    >
                      Record Custody Transfer
                    </button>
                  )}
                  {user.role === "Restorer" && (
                    <button
                      type="button"
                      onClick={() => handleModalLogEvent(EventType.Restoration, "Restoration")}
                      className="px-4 py-2 rounded-xl brand-gradient text-[#242633] text-xs font-bold shadow-xs hover:scale-[1.02] cursor-pointer"
                    >
                      Record Restoration Log
                    </button>
                  )}
                  {user.role === "Appraiser" && (
                    <button
                      type="button"
                      onClick={() => handleModalLogEvent(EventType.Appraisal, "Appraisal")}
                      className="px-4 py-2 rounded-xl brand-gradient text-[#242633] text-xs font-bold shadow-xs hover:scale-[1.02] cursor-pointer"
                    >
                      Certify Valuation
                    </button>
                  )}
                  {(user.role === "Artist" || user.role === "Admin") && (
                    <button
                      type="button"
                      onClick={() => handleModalLogEvent(EventType.Exhibition, "Curatorial Update")}
                      className="px-4 py-2 rounded-xl brand-gradient text-[#242633] text-xs font-bold shadow-xs hover:scale-[1.02] cursor-pointer"
                    >
                      Append Curatorial Record
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

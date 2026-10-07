"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { useAuth, UserRole, ROLE_DEFAULTS } from "@/context/AuthContext";
import { MOCK_ARTWORKS } from "@/lib/mockArtworks";
import { computeSHA256 } from "@/lib/hash";
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
    "journey" | "role-tools" | "portfolio" | "verifications" | "history"
  >("journey");

  const [copied, setCopied] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Embedded Forensic Verifier State
  const [verifyTokenId, setVerifyTokenId] = useState<number>(0);
  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [verifyFilePreview, setVerifyFilePreview] = useState<string | null>(null);
  const [verifyComputedHash, setVerifyComputedHash] = useState<string>("");
  const [isVerifyingHash, setIsVerifyingHash] = useState<boolean>(false);

  const selectedVerifyArtwork =
    MOCK_ARTWORKS.find((a) => a.tokenId === verifyTokenId) || MOCK_ARTWORKS[0];

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

  const handleCopy = () => {
    if (!user.address) return;
    navigator.clipboard.writeText(user.address);
    setCopied(true);
    toast.success("Wallet address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // Node collaborators across the decentralized provenance network
  const networkNodes = [
    { name: "Aria Thorne", role: "Artist", count: 2, ring: "from-[#DBBA95] to-[#FABED7]" },
    { name: "Galerie Louvre", role: "Gallery", count: 3, ring: "from-[#FABED7] to-[#F07BAF]" },
    { name: "Dr. Julian Croft", role: "Restorer", count: 2, ring: "from-[#49C98A] to-[#DBBA95]" },
    { name: "Sotheby's Heritage", role: "Appraiser", count: 1, ring: "from-[#F5A623] to-[#DBBA95]" },
    { name: "Eleanor Vance", role: "Admin", count: 1, ring: "from-[#F07BAF] to-[#E87883]" },
    { name: "Metropolitan Museum", role: "Node", count: 1, ring: "from-[#D0BCE1] to-[#FABED7]" },
    { name: "Christie's Archive", role: "Node", count: 1, ring: "from-[#DBBA95] to-[#F1D7C8]" },
  ];

  // Recent Provenance Knowledge Table data
  const ledgerKnowledgeItems = [
    {
      subject: "Genesis SHA-256 Digest Sealing",
      status: "Executed",
      statusStyle: "border-[#49C98A]/30 bg-[#49C98A]/10 text-[#1a7e4e]",
      startDate: "2026-10-06 09:12",
      endDate: "2026-10-06 09:15",
      assignedNode: "Aria Thorne (Artist)",
      artwork: "Salvator Mundi",
    },
    {
      subject: "Exhibition Custody Loan Transfer",
      status: "Active",
      statusStyle: "border-[#F07BAF]/30 bg-[#F07BAF]/10 text-[#a8245e]",
      startDate: "2026-10-05 14:30",
      endDate: "2026-10-15 18:00",
      assignedNode: "Galerie Louvre (Gallery)",
      artwork: "Girl with a Pearl Earring",
    },
    {
      subject: "Multi-Spectrum Reflectography Scan",
      status: "Executed",
      statusStyle: "border-[#49C98A]/30 bg-[#49C98A]/10 text-[#1a7e4e]",
      startDate: "2026-10-04 11:20",
      endDate: "2026-10-04 16:45",
      assignedNode: "Dr. Julian Croft (Restorer)",
      artwork: "The Starry Night",
    },
    {
      subject: "Market Valuation & Insurance Underwriting",
      status: "Scheduled",
      statusStyle: "border-[#F5A623]/30 bg-[#F5A623]/10 text-[#a86500]",
      startDate: "2026-10-07 10:00",
      endDate: "2026-10-07 12:00",
      assignedNode: "Sotheby's Heritage (Appraiser)",
      artwork: "The Kiss (Der Kuss)",
    },
  ];

  // Recharts Chart Data for Ledger Journey Metrics
  const chartData = [
    { name: "Executed Proofs", value: 5, color: "#49C98A" },
    { name: "Active Workflows", value: 7, color: "#F07BAF" },
    { name: "Scheduled Valuations", value: 3, color: "#DBBA95" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F3F0] text-[#242633] flex flex-col font-sans select-none antialiased">
      {/* 1. DEDICATED TOP BAR */}
      <header className="glass-panel border-b border-[#EEE8E3] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl brand-gradient text-[#242633] flex items-center justify-center font-black shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-[#242633] tracking-tight leading-none">
                ArtLedger
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#686878] font-bold mt-0.5">
                Curator Worksuite
              </span>
            </div>
          </div>

          {/* Center Navigation Pill Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-white/70 p-1.5 rounded-full border border-[#EEE8E3]">
            {[
              { id: "journey", label: "Provenance Journey" },
              { id: "role-tools", label: `${user.role} Studio` },
              { id: "portfolio", label: "Artworks Portfolio" },
              { id: "verifications", label: "Forensic Verifier" },
              { id: "history", label: "Ledger Activity" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? "nav-pill-active"
                      : "text-[#686878] hover:text-[#242633] hover:bg-white/80"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Tools: Search, User Avatar & Exit Button */}
        <div className="flex items-center gap-2.5">
          {/* Quick Token Search Input */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search token # or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 pl-8 pr-3 py-1.5 text-xs rounded-full bg-white/80 border border-[#EEE8E3] focus:outline-none focus:ring-2 focus:ring-[#FABED7]/40 focus:border-[#F07BAF] font-medium text-[#242633] placeholder:text-[#686878]"
            />
            <Search className="w-3.5 h-3.5 text-[#686878] absolute left-3 top-2.5" />
          </div>

          {/* Quick Round Icon Buttons */}
          <button
            type="button"
            className="w-9 h-9 rounded-2xl bg-white/80 hover:bg-white border border-[#EEE8E3] flex items-center justify-center text-[#686878] hover:text-[#242633] transition-colors shadow-2xs"
            title="Messages"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-2xl bg-white/80 hover:bg-white border border-[#EEE8E3] flex items-center justify-center text-[#686878] hover:text-[#242633] transition-colors relative shadow-2xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#F07BAF] absolute top-1.5 right-1.5 ring-2 ring-white" />
          </button>

          {/* User Profile Avatar Pill with Role Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-white/80 hover:bg-white border border-[#EEE8E3] transition-all text-xs shadow-2xs"
            >
              <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#DBBA95] via-[#FABED7] to-[#F07BAF]">
                <div className="w-7 h-7 rounded-full bg-white text-[#242633] font-extrabold flex items-center justify-center text-xs relative">
                  {user.name.charAt(0)}
                  <span className="w-2 h-2 rounded-full bg-[#49C98A] ring-1.5 ring-white absolute -bottom-0.5 -right-0.5" />
                </div>
              </div>
              <div className="text-left hidden sm:block">
                <p className="font-bold text-[#242633] leading-tight truncate max-w-[110px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-[#855e30] font-semibold leading-none">
                  {user.role} Node
                </p>
              </div>
            </button>

            {/* Switch Role Dropdown */}
            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-64 rounded-3xl glass-modal border border-white/85 shadow-xl p-3 z-50 space-y-2"
                >
                  <div className="px-2 py-1.5 border-b border-[#EEE8E3]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#686878]">
                      Switch Role Console
                    </p>
                    <p className="text-xs font-bold text-[#242633] truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    {(["Artist", "Gallery", "Restorer", "Appraiser", "Admin"] as UserRole[]).map((r) => {
                      const isCurrent = user.role === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            switchRole(r);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-colors ${
                            isCurrent
                              ? "nav-pill-active"
                              : "text-[#434553] hover:bg-white/80"
                          }`}
                        >
                          <span>{r} Console</span>
                          {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-[#242633]" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </div>

          {/* DEDICATED SIGN OUT BUTTON */}
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100/80 text-rose-600 text-xs font-bold transition-all shadow-2xs hover:scale-[1.02]"
            title="Sign out and return to public landing page"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* 2. WORKSPACE CORE: LEFT PILL DOCK + MAIN INTERACTIVE WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT VERTICAL ICON DOCK */}
        <aside className="w-18 glass-panel-subtle border-r border-[#EEE8E3] py-5 flex flex-col items-center justify-between shrink-0 hidden md:flex">
          {/* Top Actions Dock */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("journey")}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                activeTab === "journey"
                  ? "nav-pill-active shadow-sm"
                  : "bg-white/70 text-[#686878] hover:bg-white hover:text-[#242633] border border-[#EEE8E3]"
              }`}
              title="Provenance Journey"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("role-tools")}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                activeTab === "role-tools"
                  ? "nav-pill-active shadow-sm"
                  : "bg-white/70 text-[#686878] hover:bg-white hover:text-[#242633] border border-[#EEE8E3]"
              }`}
              title={`${user.role} Studio & Actions`}
            >
              {user.role === "Artist" && <Palette className="w-4 h-4 text-[#F07BAF]" />}
              {user.role === "Gallery" && <Landmark className="w-4 h-4 text-[#DBBA95]" />}
              {user.role === "Restorer" && <Hammer className="w-4 h-4 text-[#49C98A]" />}
              {user.role === "Appraiser" && <BadgeDollarSign className="w-4 h-4 text-[#F5A623]" />}
              {user.role === "Admin" && <ShieldAlert className="w-4 h-4 text-rose-500]" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("portfolio")}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                activeTab === "portfolio"
                  ? "nav-pill-active shadow-sm"
                  : "bg-white/70 text-[#686878] hover:bg-white hover:text-[#242633] border border-[#EEE8E3]"
              }`}
              title="Masterpieces Collection"
            >
              <Star className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("verifications")}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                activeTab === "verifications"
                  ? "nav-pill-active shadow-sm"
                  : "bg-white/70 text-[#686878] hover:bg-white hover:text-[#242633] border border-[#EEE8E3]"
              }`}
              title="Forensic SHA-256 Verifier"
            >
              <ShieldCheck className="w-4 h-4 text-[#49C98A]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                activeTab === "history"
                  ? "nav-pill-active shadow-sm"
                  : "bg-white/70 text-[#686878] hover:bg-white hover:text-[#242633] border border-[#EEE8E3]"
              }`}
              title="Ledger History"
            >
              <Database className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Dock Control */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-2xl brand-gradient text-[#242633] flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </aside>

        {/* MAIN APPLICATION CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <AnimatePresence mode="wait">
            {/* TAB 1: PROVENANCE JOURNEY */}
            {activeTab === "journey" && (
              <motion.div
                key="journey"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-[1500px] mx-auto"
              >
                {/* Top Banner Row: Title + Collaborators Strip */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242633] tracking-tight">
                      Provenance Journeys
                    </h1>
                    <p className="text-xs text-[#686878] font-medium mt-0.5">
                      End-to-end cryptographic lifecycle orchestration across decentralized curator nodes
                    </p>
                  </div>

                  {/* Horizontal Active Node Avatars Strip */}
                  <div className="flex items-center gap-3 glass-panel p-2.5 rounded-3xl">
                    <div className="flex items-center -space-x-1.5">
                      {networkNodes.map((node, i) => (
                        <div
                          key={i}
                          className="p-[1.5px] rounded-full bg-gradient-to-tr from-[#DBBA95] via-[#FABED7] to-[#F07BAF] ring-2 ring-white shadow-2xs relative"
                          title={`${node.name} (${node.role})`}
                        >
                          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-bold text-xs text-[#242633]">
                            {node.name.charAt(0)}
                          </div>
                          <span className="w-3.5 h-3.5 rounded-full brand-gradient text-[#242633] font-extrabold text-[8px] flex items-center justify-center absolute -bottom-1 -right-1 ring-1 ring-white shadow-2xs">
                            {node.count}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="h-6 w-px bg-[#EEE8E3] mx-1" />

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <Link
                        href="/mint"
                        className="w-8 h-8 rounded-xl bg-white hover:scale-105 border border-[#EEE8E3] text-[#242633] flex items-center justify-center transition-all shadow-2xs"
                        title="Register New Artwork"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#DBBA95]" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setActiveTab("verifications")}
                        className="w-8 h-8 rounded-xl bg-white hover:scale-105 border border-[#EEE8E3] text-[#242633] flex items-center justify-center transition-all shadow-2xs"
                        title="Forensic Verify File"
                      >
                        <FileSearch className="w-3.5 h-3.5 text-[#49C98A]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("history")}
                        className="w-8 h-8 rounded-xl bg-white hover:scale-105 border border-[#EEE8E3] text-[#242633] flex items-center justify-center transition-all shadow-2xs"
                        title="Calendar & Timeline"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#F07BAF]" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* THE CENTERPIECE: CONNECTED MULTI-STAGE JOURNEY CARD */}
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

                    <span className="inline-flex items-center gap-1.5 rounded-full font-medium border border-[#49C98A]/30 bg-[#49C98A]/10 px-3 py-1 text-xs text-[#1a7e4e]">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#49C98A] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#49C98A]"></span>
                      </span>
                      Ledger State: Verified Immutable
                    </span>
                  </div>

                  {/* The 4 Journey Columns Connected Horizontally */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                    {/* COLUMN 1: STAGE 1 - Genesis Intake */}
                    <div className="p-4 rounded-2xl bg-white/80 border border-[#EEE8E3] shadow-xs flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[#EEE8E3]">
                          <span className="text-[11px] font-bold text-[#242633]">
                            Genesis Intake
                          </span>
                          <div className="flex items-center gap-1.5 text-[#686878]">
                            <Check className="w-3.5 h-3.5 text-[#49C98A]" />
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Card Item 1 */}
                        <div className="p-3 rounded-xl bg-[#F7F3F0]/60 border border-[#EEE8E3] space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full brand-gradient text-[#242633] font-bold text-xs flex items-center justify-center">
                              A
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#242633]">
                                Allocate Piece to Artist
                              </p>
                              <p className="text-[10px] text-[#686878]">Aria Thorne (Creator)</p>
                            </div>
                          </div>
                        </div>

                        {/* Card Item 2 */}
                        <div className="p-3 rounded-xl bg-[#F7F3F0]/60 border border-[#EEE8E3] space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-white border border-[#EEE8E3] text-[#242633] font-bold text-xs flex items-center justify-center">
                              #0
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#242633]">
                                Acknowledge SHA-256 Digest
                              </p>
                              <p className="text-[10px] text-[#686878]">0x7eb6...824b</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 text-center text-[10px] font-extrabold uppercase tracking-wider text-[#686878] border-t border-[#EEE8E3]">
                        Stage 1: Intake & Minting
                      </div>
                    </div>

                    {/* COLUMN 2: STAGE 2 - Forensic Inspection */}
                    <div className="p-4 rounded-2xl bg-white/80 border border-[#EEE8E3] shadow-xs flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[#EEE8E3]">
                          <span className="text-[11px] font-bold text-[#242633]">
                            Forensic Inspection
                          </span>
                          <div className="flex items-center gap-1.5 text-[#686878]">
                            <Check className="w-3.5 h-3.5 text-[#49C98A]" />
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
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

                        <div className="p-2.5 rounded-xl bg-[#F7F3F0]/60 border border-[#EEE8E3] flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#DBBA95]/20 text-[#855e30] font-bold text-[10px] flex items-center justify-center">
                            L
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#242633] truncate">Allocate to Resolution Team</p>
                            <p className="text-[10px] text-[#686878]">Louvre Restoration Hub</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 text-center text-[10px] font-extrabold uppercase tracking-wider text-[#686878] border-t border-[#EEE8E3]">
                        Stage 2: Diagnostics
                      </div>
                    </div>

                    {/* COLUMN 3: STAGE 3 - Custody & Conservation */}
                    <div className="p-4 rounded-2xl bg-white/80 border border-[#EEE8E3] shadow-xs flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[#EEE8E3]">
                          <span className="text-[11px] font-bold text-[#242633]">
                            Custodial Execution
                          </span>
                          <div className="flex items-center gap-1.5 text-[#686878]">
                            <Check className="w-3.5 h-3.5 text-[#49C98A]" />
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
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
                          <div className="w-6 h-6 rounded-full brand-gradient text-[#242633] font-bold text-[10px] flex items-center justify-center">
                            +
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#242633] truncate">Vault Relocation</p>
                            <p className="text-[10px] text-[#686878]">Swiss Alpine Freeport</p>
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

                    {/* COLUMN 4: STAGE 4 - Valuation & Certification */}
                    <div className="p-4 rounded-2xl bg-white/80 border border-[#EEE8E3] shadow-xs flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between pb-1">
                          <span className="text-[11px] font-bold text-[#242633]">
                            Valuation & Underwrite
                          </span>
                          <span className="text-[10px] font-mono text-[#F07BAF] font-bold">Stage 4</span>
                        </div>

                        {/* Featured Brand Card */}
                        <div className="p-4 rounded-2xl brand-gradient text-[#242633] shadow-md space-y-1 relative group cursor-pointer hover:opacity-95 transition-opacity">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#242633]/80">
                              Active Processing
                            </span>
                            <Sparkles className="w-3.5 h-3.5 text-[#242633]" />
                          </div>
                          <h4 className="font-extrabold text-sm text-[#242633]">
                            Certified Valuation $450M
                          </h4>
                          <p className="text-[10px] text-[#242633]/80">
                            Sotheby&apos;s Heritage Official Appraisal
                          </p>
                        </div>

                        {/* Companion Pills */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <div className="p-2 rounded-xl bg-[#F7F3F0]/60 border border-[#EEE8E3] text-center">
                            <span className="text-[10px] font-bold text-[#242633] block">Insurance Rating</span>
                            <span className="text-[9px] text-[#1a7e4e] font-extrabold">AAA Prime</span>
                          </div>
                          <div className="p-2 rounded-xl bg-[#F7F3F0]/60 border border-[#EEE8E3] text-center">
                            <span className="text-[10px] font-bold text-[#242633] block">On-Chain State</span>
                            <span className="text-[9px] text-[#855e30] font-extrabold">Sealed</span>
                          </div>
                          <div className="p-2 rounded-xl bg-[#F7F3F0]/60 border border-[#EEE8E3] text-center">
                            <span className="text-[10px] font-bold text-[#242633] block">IPFS CID</span>
                            <span className="text-[9px] text-[#686878] font-mono">QmX7...</span>
                          </div>
                          <div className="p-2 rounded-xl bg-[#F7F3F0]/60 border border-[#EEE8E3] text-center">
                            <span className="text-[10px] font-bold text-[#242633] block">Events Logged</span>
                            <span className="text-[9px] text-[#242633] font-extrabold">4 Records</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 text-center text-[10px] font-extrabold uppercase tracking-wider text-[#686878] border-t border-[#EEE8E3]">
                        Stage 4: Certification
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM ANALYTICAL WIDGETS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Widget: "Suggested Knowledge / Recent Ledger Logs" (8 Columns) */}
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
                        className="p-2 rounded-xl bg-white hover:bg-[#F7F3F0] border border-[#EEE8E3] text-[#686878] hover:text-[#242633] transition-colors"
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
                              <td className="py-3 px-3 font-bold text-[#242633]">
                                {item.subject}
                              </td>
                              <td className="py-3 px-3 text-[#434553] font-medium">
                                {item.artwork}
                              </td>
                              <td className="py-3 px-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${item.statusStyle}`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-[#686878] font-mono text-[11px]">
                                {item.startDate.split(" ")[0]}
                              </td>
                              <td className="py-3 px-3 text-[#242633] font-medium">
                                {item.assignedNode}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Widget: "Ledger Journey Metrics" (4 Columns with Recharts Donut) */}
                  <div className="lg:col-span-4 p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#242633]">
                        Ledger Journey Metrics
                      </h3>
                      <p className="text-xs text-[#686878] font-medium">
                        Cryptographic protocol execution distribution
                      </p>
                    </div>

                    {/* Donut Chart via Recharts */}
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

                    {/* Metric Legend Pills */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#EEE8E3]">
                      <div className="p-2 rounded-2xl bg-[#49C98A]/10 border border-[#49C98A]/30 text-center">
                        <span className="text-base font-black text-[#1a7e4e] block">5</span>
                        <span className="text-[10px] font-bold text-[#1a7e4e]">Executed</span>
                      </div>
                      <div className="p-2 rounded-2xl bg-[#F07BAF]/10 border border-[#F07BAF]/30 text-center">
                        <span className="text-base font-black text-[#a8245e] block">7</span>
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

            {/* TAB 2: ROLE-SPECIFIC STUDIO / TOOLS */}
            {activeTab === "role-tools" && (
              <motion.div
                key="role-tools"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-[1500px] mx-auto"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-[#242633]">
                      {user.role} Dedicated Workspace
                    </h2>
                    <p className="text-xs text-[#686878]">
                      Specialized on-chain actions authorized exclusively for your credential: {ROLE_DEFAULTS[user.role].title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#686878]">Switch Role:</span>
                    <div className="flex items-center gap-1 bg-white/80 p-1 rounded-2xl border border-[#EEE8E3]">
                      {(["Artist", "Gallery", "Restorer", "Appraiser", "Admin"] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => switchRole(r)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            user.role === r
                              ? "nav-pill-active shadow-xs"
                              : "text-[#686878] hover:bg-[#F7F3F0] hover:text-[#242633]"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dynamically render the dedicated role console view */}
                {user.role === "Artist" && <ArtistDashboardView />}
                {user.role === "Gallery" && <GalleryDashboardView />}
                {user.role === "Restorer" && <RestorerDashboardView />}
                {user.role === "Appraiser" && <AppraiserDashboardView />}
                {user.role === "Admin" && <AdminDashboardView />}
              </motion.div>
            )}

            {/* TAB 3: MASTERPIECES PORTFOLIO */}
            {activeTab === "portfolio" && (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-[1500px] mx-auto"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-[#242633]">
                      Masterpieces Collection Registry
                    </h2>
                    <p className="text-xs text-[#686878]">
                      8 Registered museum-grade artworks with immutable SHA-256 fingerprints
                    </p>
                  </div>

                  <Link
                    href="/mint"
                    className="px-4 py-2.5 rounded-2xl brand-gradient text-[#242633] text-xs font-extrabold flex items-center gap-1.5 shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)] hover:scale-[1.02] transition-all self-start sm:self-auto"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Register New Masterpiece</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {MOCK_ARTWORKS.map((item) => (
                    <div
                      key={item.tokenId}
                      className="rounded-3xl glass-panel overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
                    >
                      <div className="aspect-[4/3] bg-white/60 relative overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#242633] shadow-xs border border-[#EEE8E3]">
                          Token #{item.tokenId}
                        </div>
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#49C98A] text-white shadow-xs flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="font-bold text-sm text-[#242633] truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-[#686878] font-medium">
                            {item.artistName} ({item.year})
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/80 border border-[#EEE8E3] space-y-0.5">
                          <span className="text-[9px] uppercase font-bold text-[#686878] block">
                            SHA-256 Fingerprint
                          </span>
                          <span className="font-mono text-[10px] text-[#434553] block truncate">
                            {item.imageHash}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-[#EEE8E3] flex items-center justify-between text-xs">
                          <span className="text-[11px] text-[#686878] font-medium">
                            {item.medium}
                          </span>
                          <Link
                            href={`/artwork/${item.tokenId}`}
                            className="text-xs font-bold text-[#F07BAF] hover:text-[#242633] inline-flex items-center gap-1 transition-colors"
                          >
                            <span>Timeline</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB 4: FORENSIC VERIFIER TOOL */}
            {activeTab === "verifications" && (
              <motion.div
                key="verifications"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-5xl mx-auto py-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#EEE8E3]">
                  <div>
                    <h2 className="text-2xl font-black text-[#242633] flex items-center gap-2">
                      <FileSearch className="w-6 h-6 text-[#49C98A]" />
                      <span>Forensic Cryptographic Comparator</span>
                    </h2>
                    <p className="text-xs text-[#686878] font-medium">
                      Compute SHA-256 digests in real time and verify physical artwork authenticity against the ledger.
                    </p>
                  </div>

                  <Link
                    href={`/verify?id=${selectedVerifyArtwork.tokenId}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border border-[#EEE8E3] bg-white/80 text-[#242633] hover:bg-white text-xs font-bold transition-all shadow-2xs shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#686878]" />
                    <span>Standalone Engine</span>
                  </Link>
                </div>

                {/* Masterpiece Selection Chips */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#686878] block">
                    Select Registered Artwork to Inspect:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_ARTWORKS.map((art) => {
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
                          className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
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

                    <div className="aspect-[4/3] rounded-2xl bg-white/60 overflow-hidden relative border border-[#EEE8E3]">
                      <img
                        src={selectedVerifyArtwork.imageUrl}
                        alt={selectedVerifyArtwork.title}
                        className="w-full h-full object-cover"
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
                          className="flex-1 px-3 py-2 rounded-2xl bg-[#49C98A]/10 hover:bg-[#49C98A]/20 border border-[#49C98A]/30 text-[#1a7e4e] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5 text-[#49C98A]" />
                          <span>Load Authentic File Hash</span>
                        </button>

                        <button
                          type="button"
                          onClick={loadCounterfeitSample}
                          className="flex-1 px-3 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
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

            {/* TAB 5: ON-CHAIN ACTIVITY LOG */}
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
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

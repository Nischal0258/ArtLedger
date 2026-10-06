"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Smartphone,
  Database,
  Calendar,
  Send,
  Shield,
  Sun,
  Moon,
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
  FileCheck2,
  RefreshCw,
  Award,
  ArrowRightLeft,
} from "lucide-react";
import { useAuth, UserRole, ROLE_DEFAULTS } from "@/context/AuthContext";
import { MOCK_ARTWORKS } from "@/lib/mockArtworks";
import { toast } from "sonner";

// Import role-specific consoles for deep tab switching
import { ArtistDashboardView } from "./ArtistDashboardView";
import { GalleryDashboardView } from "./GalleryDashboardView";
import { RestorerDashboardView } from "./RestorerDashboardView";
import { AppraiserDashboardView } from "./AppraiserDashboardView";
import { AdminDashboardView } from "./AdminDashboardView";

export function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, switchRole, logout } = useAuth();

  // Navigation tab inside the dashboard (Cases/Journey inspired by sugarCRM screenshot)
  const [activeTab, setActiveTab] = useState<
    "journey" | "role-tools" | "portfolio" | "verifications" | "history"
  >("journey");

  const [copied, setCopied] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Protected Route Guard: If not authenticated, redirect to "/"
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#eef2f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500">Launching ArtLedger Application Workspace...</p>
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

  // Node collaborators across the decentralized provenance network (matching the avatars strip in screenshot)
  const networkNodes = [
    { name: "Aria Thorne", role: "Artist", count: 2, bg: "bg-purple-100 text-purple-700", ring: "ring-purple-400" },
    { name: "Galerie Louvre", role: "Gallery", count: 3, bg: "bg-blue-100 text-blue-700", ring: "ring-blue-400" },
    { name: "Dr. Julian Croft", role: "Restorer", count: 2, bg: "bg-emerald-100 text-emerald-700", ring: "ring-emerald-400" },
    { name: "Sotheby's Heritage", role: "Appraiser", count: 1, bg: "bg-amber-100 text-amber-700", ring: "ring-amber-400" },
    { name: "Eleanor Vance", role: "Admin", count: 1, bg: "bg-rose-100 text-rose-700", ring: "ring-rose-400" },
    { name: "Metropolitan Museum", role: "Node", count: 1, bg: "bg-indigo-100 text-indigo-700", ring: "ring-indigo-400" },
    { name: "Christie's Archive", role: "Node", count: 1, bg: "bg-slate-100 text-slate-700", ring: "ring-slate-400" },
  ];

  // Recent Provenance Knowledge Table data (matching "Suggested Knowledge" table in screenshot)
  const ledgerKnowledgeItems = [
    {
      subject: "Genesis SHA-256 Digest Sealing",
      status: "Executed",
      statusColor: "bg-[#83a2db]/20 text-[#2c4e8a] border border-[#83a2db]/40",
      startDate: "2026-10-06 09:12",
      endDate: "2026-10-06 09:15",
      assignedNode: "Aria Thorne (Artist)",
      artwork: "Salvator Mundi",
    },
    {
      subject: "Exhibition Custody Loan Transfer",
      status: "Active",
      statusColor: "bg-[#ce6969]/20 text-[#8f2828] border border-[#ce6969]/40",
      startDate: "2026-10-05 14:30",
      endDate: "2026-10-15 18:00",
      assignedNode: "Galerie Louvre (Gallery)",
      artwork: "Girl with a Pearl Earring",
    },
    {
      subject: "Multi-Spectrum Reflectography Scan",
      status: "Executed",
      statusColor: "bg-[#83a2db]/20 text-[#2c4e8a] border border-[#83a2db]/40",
      startDate: "2026-10-04 11:20",
      endDate: "2026-10-04 16:45",
      assignedNode: "Dr. Julian Croft (Restorer)",
      artwork: "The Starry Night",
    },
    {
      subject: "Market Valuation & Insurance Underwriting",
      status: "Scheduled",
      statusColor: "bg-amber-100 text-amber-800 border border-amber-300",
      startDate: "2026-10-07 10:00",
      endDate: "2026-10-07 12:00",
      assignedNode: "Sotheby's Heritage (Appraiser)",
      artwork: "The Kiss (Der Kuss)",
    },
  ];

  return (
    <div className="min-h-screen bg-[#eef2f6] text-slate-900 flex flex-col font-sans select-none antialiased">
      {/* 1. TOP APPLICATION SYSTEM FRAME (Browser / Desktop app aesthetic) */}
      <div className="bg-[#e4e8ee] border-b border-slate-300/80 px-4 py-2 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          {/* Mac window dots */}
          <div className="flex items-center gap-1.5 mr-3">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-xs" />
          </div>
          <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
            artledger-app // environment: ethereum-local-node-31337
          </span>
        </div>

        {/* Browser URL Pill */}
        <div className="hidden md:flex items-center gap-2 px-6 py-1 rounded-full bg-white/80 border border-slate-200 text-[11px] font-mono text-slate-600 shadow-2xs">
          <span className="text-slate-400">https://</span>
          <span className="font-bold text-slate-800">app.artledger.io</span>
          <span className="text-indigo-600">/provenance-journey</span>
        </div>

        {/* Network & Active Role Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Node Live</span>
          </div>
          <span className="text-[11px] font-bold text-slate-600">
            Role: <strong className="text-indigo-600 font-extrabold">{user.role}</strong>
          </span>
        </div>
      </div>

      {/* 2. DEDICATED APPLICATION TOP BAR (SugarCRM / Modern SaaS Style) */}
      <header className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#10141a] text-white flex items-center justify-center font-black shadow-sm">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base text-[#10141a] tracking-tight leading-none">
                ArtLedger
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold mt-0.5">
                Curator Worksuite
              </span>
            </div>
          </div>

          {/* Center Navigation Pill Tabs (Cases / Journeys style) */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#f1f5f9] p-1 rounded-full border border-slate-200/60">
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
                      ? "bg-[#10141a] text-white shadow-sm"
                      : "text-slate-600 hover:text-[#10141a] hover:bg-white/60"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Tools: Search, Messages, Notifications, User Avatar & Exit Button */}
        <div className="flex items-center gap-2.5">
          {/* Quick Token Search Icon / Input */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search token # or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-44 pl-8 pr-3 py-1.5 text-xs rounded-full bg-[#f1f5f9] border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800 placeholder:text-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          {/* Quick Round Icon Buttons */}
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-[#f1f5f9] hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors shadow-2xs"
            title="Messages"
          >
            <Mail className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-[#f1f5f9] hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors relative shadow-2xs"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-1 ring-2 ring-white" />
          </button>

          {/* User Profile Avatar Pill with Role Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-[#f1f5f9] hover:bg-slate-200/80 border border-slate-200 transition-all text-xs shadow-2xs"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                {user.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-indigo-600 font-semibold leading-none">
                  {user.role} Node
                </p>
              </div>
            </button>

            {/* Switch Role Dropdown (Allows testing all 5 roles on the fly) */}
            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 animate-fade-in space-y-2">
                  <div className="px-2 py-1 border-b border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Role Console
                    </p>
                    <p className="text-xs font-bold text-slate-900 truncate">
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
                              ? "bg-indigo-50 text-indigo-700"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span>{r} Console</span>
                          {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* DEDICATED SIGN OUT BUTTON (The ONLY way to exit back to landing page) */}
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100/80 text-rose-700 text-xs font-bold transition-all shadow-2xs hover:scale-[1.02]"
            title="Sign out and return to public landing page"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* 3. WORKSPACE CORE: LEFT PILL DOCK + MAIN INTERACTIVE WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT VERTICAL ICON DOCK (Matching the screenshot's left vertical pill sidebar) */}
        <aside className="w-16 bg-[#eef2f6] border-r border-slate-300/80 py-4 flex flex-col items-center justify-between shrink-0 hidden md:flex">
          {/* Top Actions Dock */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("journey")}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                activeTab === "journey"
                  ? "bg-white text-[#10141a] shadow-md border border-slate-200 font-bold"
                  : "bg-white/60 text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent"
              }`}
              title="Provenance Journey"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("role-tools")}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                activeTab === "role-tools"
                  ? "bg-white text-[#10141a] shadow-md border border-slate-200 font-bold"
                  : "bg-white/60 text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent"
              }`}
              title={`${user.role} Studio & Actions`}
            >
              {user.role === "Artist" && <Palette className="w-4 h-4 text-purple-600" />}
              {user.role === "Gallery" && <Landmark className="w-4 h-4 text-blue-600" />}
              {user.role === "Restorer" && <Hammer className="w-4 h-4 text-emerald-600" />}
              {user.role === "Appraiser" && <BadgeDollarSign className="w-4 h-4 text-amber-600" />}
              {user.role === "Admin" && <ShieldAlert className="w-4 h-4 text-rose-600" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("portfolio")}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                activeTab === "portfolio"
                  ? "bg-white text-[#10141a] shadow-md border border-slate-200 font-bold"
                  : "bg-white/60 text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent"
              }`}
              title="Masterpieces Collection"
            >
              <Star className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("verifications")}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                activeTab === "verifications"
                  ? "bg-white text-[#10141a] shadow-md border border-slate-200 font-bold"
                  : "bg-white/60 text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent"
              }`}
              title="Forensic SHA-256 Verifier"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                activeTab === "history"
                  ? "bg-white text-[#10141a] shadow-md border border-slate-200 font-bold"
                  : "bg-white/60 text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent"
              }`}
              title="Ledger History"
            >
              <Database className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Dock Control */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#10141a] text-white flex items-center justify-center shadow-md">
              <Sun className="w-4 h-4 text-amber-300" />
            </div>
          </div>
        </aside>

        {/* MAIN APPLICATION CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB 1: PROVENANCE JOURNEY (DIRECT VISUAL IMPLEMENTATION OF THE USER'S INSPIRATION) */}
          {activeTab === "journey" && (
            <div className="space-y-6 animate-fade-in max-w-[1500px] mx-auto">
              {/* Top Banner Row: Title + Collaborators Strip */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10141a] tracking-tight">
                    Provenance Journeys
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    End-to-end cryptographic lifecycle orchestration across decentralized curator nodes
                  </p>
                </div>

                {/* Horizontal Active Node Avatars Strip (From SugarCRM Screenshot) */}
                <div className="flex items-center gap-3 bg-white/80 border border-slate-200 p-2 rounded-2xl shadow-2xs">
                  <div className="flex items-center -space-x-1.5">
                    {networkNodes.map((node, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full ${node.bg} flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-2xs relative`}
                        title={`${node.name} (${node.role})`}
                      >
                        {node.name.charAt(0)}
                        <span className="w-3.5 h-3.5 rounded-full bg-[#83a2db] text-white font-extrabold text-[8px] flex items-center justify-center absolute -bottom-1 -right-1 ring-1 ring-white">
                          {node.count}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-6 w-px bg-slate-200 mx-1" />

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <Link
                      href="/mint"
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                      title="Register New Artwork"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/verify"
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                      title="Forensic Verify File"
                    >
                      <FileSearch className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setActiveTab("history")}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                      title="Calendar & Timeline"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* THE CENTERPIECE: CONNECTED MULTI-STAGE JOURNEY CARD (Exact Layout from SugarCRM Inspiration) */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#f1f5f9] border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400">
                      Active Provenance Pipeline
                    </span>
                    <h2 className="text-lg font-black text-slate-900">
                      Artwork Lifecycle Management (Token #0: Salvator Mundi)
                    </h2>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Ledger State: Verified Immutable
                  </span>
                </div>

                {/* The 4 Journey Columns Connected Horizontally */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                  {/* COLUMN 1: STAGE 1 - Case Allocation / Genesis Intake */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-[11px] font-bold text-slate-700">
                          Genesis Intake
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Card Item 1 */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                            A
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              Allocate Piece to Artist
                            </p>
                            <p className="text-[10px] text-slate-400">Aria Thorne (Creator)</p>
                          </div>
                        </div>
                      </div>

                      {/* Card Item 2 */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                            #0
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              Acknowledge SHA-256 Digest
                            </p>
                            <p className="text-[10px] text-slate-400">0x7eb6...824b</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 text-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-t border-slate-100">
                      Stage 1: Intake & Minting
                    </div>
                  </div>

                  {/* COLUMN 2: STAGE 2 - Issue Identification / Integrity Inspection */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-[11px] font-bold text-slate-700">
                          Forensic Inspection
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center">
                          J
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">Identify Condition Grade</p>
                          <p className="text-[10px] text-slate-400">Pristine Stabilization</p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center">
                          J
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">Pigment Reflectography</p>
                          <p className="text-[10px] text-slate-400">Infrared & UV Analysis</p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                          L
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">Allocate to Resolution Team</p>
                          <p className="text-[10px] text-slate-400">Louvre Restoration Hub</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 text-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-t border-slate-100">
                      Stage 2: Diagnostics
                    </div>
                  </div>

                  {/* COLUMN 3: STAGE 3 - Technical Resolution / Custody & Conservation */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-[11px] font-bold text-slate-700">
                          Custodial Execution
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                          +
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">Museum Exhibition Loan</p>
                          <p className="text-[10px] text-slate-400">National Gallery London</p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                          +
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">Vault Relocation</p>
                          <p className="text-[10px] text-slate-400">Swiss Alpine Freeport</p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center">
                          J
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">Varnish Stabilization</p>
                          <p className="text-[10px] text-slate-400">Chemical Treatment Logged</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 text-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-t border-slate-100">
                      Stage 3: Custody & Care
                    </div>
                  </div>

                  {/* COLUMN 4: STAGE 4 - New Tasks / Valuation & Certification (High-contrast Black Card from Screenshot) */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-[11px] font-bold text-slate-700">
                          Valuation & Underwrite
                        </span>
                        <span className="text-[10px] font-mono text-indigo-600 font-bold">Stage 4</span>
                      </div>

                      {/* Primary Solid Black Card with arrow (Exact replication from the SugarCRM inspiration) */}
                      <div className="p-4 rounded-2xl bg-[#10141a] text-white shadow-lg space-y-1 relative group cursor-pointer hover:bg-slate-900 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#83a2db]">
                            Active Processing
                          </span>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        </div>
                        <h4 className="font-extrabold text-sm text-white">
                          Certified Valuation $450M
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          Sotheby&apos;s Heritage Official Appraisal
                        </p>
                      </div>

                      {/* White companion pills */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                          <span className="text-[10px] font-bold text-slate-700 block">Insurance Rating</span>
                          <span className="text-[9px] text-emerald-600 font-extrabold">AAA Prime</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                          <span className="text-[10px] font-bold text-slate-700 block">On-Chain State</span>
                          <span className="text-[9px] text-indigo-600 font-extrabold">Sealed</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                          <span className="text-[10px] font-bold text-slate-700 block">IPFS CID</span>
                          <span className="text-[9px] text-slate-500 font-mono">QmX7...</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                          <span className="text-[10px] font-bold text-slate-700 block">Events Logged</span>
                          <span className="text-[9px] text-slate-800 font-extrabold">4 Records</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 text-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-t border-slate-100">
                      Stage 4: Certification
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM ANALYTICAL WIDGETS (Matching the bottom widgets in the SugarCRM screenshot) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Widget: "Suggested Knowledge / Recent Ledger Logs" (8 Columns) */}
                <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Ledger Provenance History & Knowledge
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        Audited cryptographic events across verified institutional nodes
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toast.info("Syncing with Ethereum node...")}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#f1f5f9] text-slate-500 font-bold text-[11px] border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Subject</th>
                          <th className="py-2.5 px-3">Artwork</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Assigned Node</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {ledgerKnowledgeItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-3 font-bold text-slate-900">
                              {item.subject}
                            </td>
                            <td className="py-3 px-3 text-slate-600 font-medium">
                              {item.artwork}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${item.statusColor}`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                              {item.startDate.split(" ")[0]}
                            </td>
                            <td className="py-3 px-3 text-slate-700 font-medium">
                              {item.assignedNode}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Widget: "Support Ticket Journey / Protocol Performance" (4 Columns with Donut Arcs) */}
                <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Ledger Journey Metrics
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Cryptographic protocol execution metrics
                    </p>
                  </div>

                  {/* Donut Arc Visual using exact colors from image: #83a2db (Executed) and #ce6969 (Active) */}
                  <div className="py-4 flex items-center justify-center">
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background track */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#f1f5f9"
                          strokeWidth="12"
                        />
                        {/* Blue Arc: #83a2db (5 Executed) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#83a2db"
                          strokeWidth="12"
                          strokeDasharray="238.76"
                          strokeDashoffset="100"
                          strokeLinecap="round"
                        />
                        {/* Coral Arc: #ce6969 (7 Active) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#ce6969"
                          strokeWidth="12"
                          strokeDasharray="238.76"
                          strokeDashoffset="180"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-black text-[#10141a]">12</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Total Proofs</span>
                      </div>
                    </div>
                  </div>

                  {/* Metric Legend Pills */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <div className="p-3 rounded-2xl bg-[#83a2db]/10 border border-[#83a2db]/30 text-center">
                      <span className="text-xl font-black text-[#2c4e8a] block">5</span>
                      <span className="text-[11px] font-bold text-[#2c4e8a]">Executed Proofs</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#ce6969]/10 border border-[#ce6969]/30 text-center">
                      <span className="text-xl font-black text-[#8f2828] block">7</span>
                      <span className="text-[11px] font-bold text-[#8f2828]">Active Workflows</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROLE-SPECIFIC STUDIO / TOOLS */}
          {activeTab === "role-tools" && (
            <div className="space-y-6 animate-fade-in max-w-[1500px] mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {user.role} Dedicated Workspace
                  </h2>
                  <p className="text-xs text-slate-500">
                    Specialized on-chain actions authorized exclusively for your credential: {ROLE_DEFAULTS[user.role].title}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Switch Role:</span>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                    {(["Artist", "Gallery", "Restorer", "Appraiser", "Admin"] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => switchRole(r)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          user.role === r
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "text-slate-600 hover:bg-slate-100"
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
            </div>
          )}

          {/* TAB 3: MASTERPIECES PORTFOLIO */}
          {activeTab === "portfolio" && (
            <div className="space-y-6 animate-fade-in max-w-[1500px] mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Masterpieces Collection Registry
                  </h2>
                  <p className="text-xs text-slate-500">
                    8 Registered museum-grade artworks with immutable SHA-256 fingerprints
                  </p>
                </div>

                <Link
                  href="/mint"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Register New Masterpiece</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOCK_ARTWORKS.map((item) => (
                  <div
                    key={item.tokenId}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
                  >
                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-slate-800 shadow-xs border border-slate-200">
                        Token #{item.tokenId}
                      </div>
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {item.artistName} ({item.year})
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">
                          SHA-256 Fingerprint
                        </span>
                        <span className="font-mono text-[10px] text-slate-600 block truncate">
                          {item.imageHash}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {item.medium}
                        </span>
                        <Link
                          href={`/artwork/${item.tokenId}`}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                        >
                          <span>Timeline</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FORENSIC VERIFIER LAUNCHER */}
          {activeTab === "verifications" && (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto py-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-bold shadow-xs">
                  <FileSearch className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  Forensic Cryptographic Comparator
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Drag and drop any high-resolution physical artwork image to compute its SHA-256 hash client-side and match it with the immutable on-chain ledger.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
                <Link
                  href="/verify"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                >
                  <FileSearch className="w-4 h-4" />
                  <span>Launch Standalone Verification Engine</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* TAB 5: ON-CHAIN ACTIVITY LOG */}
          {activeTab === "history" && (
            <div className="space-y-6 animate-fade-in max-w-[1500px] mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Decentralized Audit Trail
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live chronological events synchronized with Ethereum local node 31337
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                {ledgerKnowledgeItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{item.subject}</span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          ({item.artwork})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Actor: <strong className="text-slate-700">{item.assignedNode}</strong> • Timestamp: {item.startDate}
                      </p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${item.statusColor} shrink-0`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Palette,
  ShieldCheck,
  Wallet,
  Activity,
  PlusCircle,
  FileSearch,
  History,
  LogOut,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MOCK_ARTWORKS } from "@/lib/mockArtworks";
import { toast } from "sonner";

export function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Protected Route Guard: If unauthenticated, immediately redirect to "/"
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading your collection...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 7)}...${addr.slice(-4)}`;
  };

  const handleCopy = () => {
    if (!user.address) return;
    navigator.clipboard.writeText(user.address);
    setCopied(true);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // User's registered / saved collection items
  const userCollection = MOCK_ARTWORKS.slice(0, 4);

  // Recent transaction activity log
  const transactions = [
    {
      id: "tx-1",
      action: "Genesis Artwork Registration",
      target: "Salvator Mundi (Token #0)",
      timestamp: "Today, 14:20",
      status: "Confirmed",
      hash: "0x3f7a...9c21",
    },
    {
      id: "tx-2",
      action: "Custody Transfer & Exhibition Loan",
      target: "Girl with a Pearl Earring (Token #1)",
      timestamp: "Yesterday, 18:45",
      status: "Confirmed",
      hash: "0x8e2b...4d17",
    },
    {
      id: "tx-3",
      action: "Forensic Integrity Verification",
      target: "The Starry Night (Token #2)",
      timestamp: "Oct 04, 2026",
      status: "Verified",
      hash: "0x1a9c...7e54",
    },
    {
      id: "tx-4",
      action: "Market Valuation & Insurance Certification",
      target: "The Kiss (Der Kuss) (Token #4)",
      timestamp: "Sep 28, 2026",
      status: "Confirmed",
      hash: "0x5d4f...2b80",
    },
  ];

  return (
    <div className="flex-1 bg-[#f8fafc] text-slate-900 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
        {/* DASHBOARD HEADER & USER PROFILE CARD */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-600/20 shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {user.authType === "demo" ? "Sandbox Account" : "Web3 Account"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {user.email}
              </p>
            </div>
          </div>

          {/* Right Header: Wallet Address Pill & Sign Out Button */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Truncated Address Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 font-semibold shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{truncateAddress(user.address)}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                title="Copy full address"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Clear Sign Out / Disconnect Button */}
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 text-rose-700 text-xs font-bold transition-all shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out / Disconnect</span>
            </button>
          </div>
        </div>

        {/* ACCOUNT SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Artworks Owned */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Artworks Owned
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {userCollection.length} Masterpieces
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Active in your fine art portfolio
            </p>
          </div>

          {/* Card 2: Verified Items */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Verified Items
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              100% Authentic
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              SHA-256 cryptographic match
            </p>
          </div>

          {/* Card 3: Wallet Balance */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Wallet Balance
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {user.balance || "2.45 ETH"}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Available Ethereum balance
            </p>
          </div>

          {/* Card 4: Total Transactions */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Transactions
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              12 Recorded
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              On-chain provenance events
            </p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Quick Actions</span>
            </h3>
            <span className="text-xs text-slate-400">
              Direct access to platform operations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Action 1: Register Artwork */}
            <Link
              href="/mint"
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all group flex items-start gap-3 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 border border-slate-200 flex items-center justify-center shadow-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Register Artwork
                </h4>
                <p className="text-xs text-slate-500 leading-snug">
                  Mint a new piece with client-side SHA-256 verification and IPFS storage.
                </p>
              </div>
            </Link>

            {/* Action 2: Verify Authenticity */}
            <Link
              href="/verify"
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all group flex items-start gap-3 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 border border-slate-200 flex items-center justify-center shadow-xs shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileSearch className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Verify Authenticity
                </h4>
                <p className="text-xs text-slate-500 leading-snug">
                  Cross-examine physical art files against on-chain SHA-256 hashes.
                </p>
              </div>
            </Link>

            {/* Action 3: Transaction History */}
            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all group flex items-start gap-3 text-left shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-blue-600 border border-slate-200 flex items-center justify-center shadow-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <History className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  Transaction History
                </h4>
                <p className="text-xs text-slate-500 leading-snug">
                  Review your recent custodial provenance actions and ledger events.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* RECENT ARTWORKS / ACTIVITY GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Your Fine Art Collection
              </h3>
              <p className="text-xs text-slate-500">
                Authenticated masterpieces with immutable SHA-256 records on Ethereum
              </p>
            </div>

            <Link
              href="/explore"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              <span>Explore All Artworks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {userCollection.map((item) => (
              <div
                key={item.tokenId}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-slate-800 shadow-sm border border-slate-200">
                    Token #{item.tokenId}
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
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

                  {/* Hash digest snippet */}
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">
                      SHA-256 Digest
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
                      <span>View Provenance</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ON-CHAIN TRANSACTION HISTORY FEED */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>Recent Provenance Ledger Activity</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Synchronized with Ethereum local node
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{tx.action}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      {tx.target}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Tx Hash: <span className="font-mono text-slate-600">{tx.hash}</span> • {tx.timestamp}
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  {tx.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TRANSACTION HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowHistoryModal(false)}
          />
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 z-10 space-y-4 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                <span>Full Ledger Transaction History</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{tx.action}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      {tx.status}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">{tx.target}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 font-mono">
                    <span>{tx.hash}</span>
                    <span>{tx.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

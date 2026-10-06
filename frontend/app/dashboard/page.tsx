"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAccount, useBalance, useReadContract } from "wagmi";
import {
  LayoutDashboard,
  Palette,
  ShieldCheck,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Wallet,
  CheckCircle2,
  FileSearch,
  ExternalLink,
  Lock,
  PlusCircle,
  HelpCircle,
  User,
} from "lucide-react";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "@/lib/contract";
import { useUserRole } from "@/hooks/useUserRole";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { AddressPill } from "@/components/ui/AddressPill";
import { CopyButton } from "@/components/ui/CopyButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";
import { AuthGate } from "@/components/auth/AuthGate";
import { MOCK_ARTWORKS } from "@/lib/mockArtworks";

export default function DashboardPage() {
  const {
    address,
    isDemoMode,
    activePersona,
    switchDemoPersona,
    roleHash,
    isArtist,
    isGallery,
    isRestorer,
    isAppraiser,
    isDefaultAdmin,
  } = useUserRole();
  const { data: balanceData } = useBalance({
    address: address as `0x${string}` | undefined,
  });

  const [activeTab, setActiveTab] = useState<"artworks" | "tools" | "permissions">(
    "artworks"
  );

  // Read total supply of minted artworks
  const { data: totalSupplyData } = useReadContract({
    address: ARTLEDGER_ADDRESS,
    abi: ARTLEDGER_ABI,
    functionName: "totalSupply",
  });

  const totalSupply = totalSupplyData !== undefined ? Number(totalSupplyData) : 0;

  // Union of on-chain IDs and mock artworks
  const displayedArtworkIds = React.useMemo(() => {
    const ids = new Set<number>();
    for (let i = 0; i < totalSupply; i++) {
      ids.add(i);
    }
    MOCK_ARTWORKS.forEach((m) => ids.add(m.tokenId));
    return Array.from(ids);
  }, [totalSupply]);

  return (
    <AuthGate
      title="Curator Dashboard Login"
      description="Connect your Web3 wallet to access your fine art portfolio, institutional provenance actions, and forensic verification tools."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 animate-fade-in">
        {/* Welcome Header Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-lg shadow-brand-500/20">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>Authenticated Curator Portal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Curator Command Center
                </h1>
                <div className="flex items-center gap-2">
                  <AddressPill address={address} chars={6} />
                </div>
              </div>
            </div>

            {/* Quick Metrics & Account Info */}
            <div className="flex flex-wrap items-center gap-6 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6 w-full lg:w-auto">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Connected Balance
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {isDemoMode
                    ? "10,000.00 ETH (Virtual)"
                    : balanceData
                    ? `${Number(balanceData.formatted).toFixed(4)} ${balanceData.symbol}`
                    : "0.00 ETH"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Ledger Registry
                </span>
                <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                  {displayedArtworkIds.length} Masterpieces
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Network State
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {isDemoMode ? "Virtual Local Node" : "Sepolia / Local Node"}
                </span>
              </div>
            </div>
          </div>

          {/* Virtual Demo Wallet Persona Banner */}
          {isDemoMode && activePersona && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-brand-500/5 -mx-6 -mb-6 p-4 sm:px-6 rounded-b-3xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎭</span>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Virtual Demo Wallet Active: {activePersona.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-semibold border border-brand-500/20">
                      {activePersona.roleTitle}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {activePersona.description}
                  </p>
                </div>
              </div>
              <div className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 shrink-0">
                Switch persona anytime via top-right menu ↗
              </div>
            </div>
          )}

          {/* Active Roles & Capability Strip */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-1">
              Active Curator Credentials:
            </span>
            <RoleBadge roleHash={roleHash} />
            {isDefaultAdmin && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Shield className="w-3 h-3" />
                Contract Administrator
              </span>
            )}
          </div>
        </div>

        {/* Primary Curator Action Cards (Features moved into Dashboard) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Register Artwork */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between group hover:border-brand-500/50 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Palette className="w-6 h-6" />
                </div>
                {isArtist || isDefaultAdmin ? (
                  <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Authorized
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                    Artist Role Needed
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                  Register Artwork
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Genesis minting wizard with client-side SHA-256 fingerprinting and decentralized IPFS pinning.
                </p>
              </div>
            </div>
            <div className="pt-6">
              <Link
                href="/mint"
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-purple-500/20"
              >
                <span>Launch Registration Wizard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Forensic Hash Verifier */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between group hover:border-brand-500/50 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <FileSearch className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                  Forensic Tool
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                  Verify Hash
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Compare any image file against immutable on-chain SHA-256 records to detect alterations and confirm authenticity.
                </p>
              </div>
            </div>
            <div className="pt-6">
              <Link
                href="/verify"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
              >
                <span>Launch Forensic Comparator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Admin Portal (Visible or highlighted according to user role) */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between group hover:border-brand-500/50 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                {isDefaultAdmin ? (
                  <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Administrator
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                    Admin Gated
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                  Curator Role Admin
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Grant or revoke institutional credentials (Gallery, Restorer, Appraiser, Artist) across the ledger.
                </p>
              </div>
            </div>
            <div className="pt-6">
              {isDefaultAdmin ? (
                <Link
                  href="/admin"
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
                >
                  <span>Open Admin Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-semibold text-xs cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Access Restricted</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="space-y-6">
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
            <button
              onClick={() => setActiveTab("artworks")}
              className={`pb-3 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === "artworks"
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Registered Artworks ({displayedArtworkIds.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("tools")}
              className={`pb-3 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === "tools"
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Curator Workflows</span>
            </button>
            <button
              onClick={() => setActiveTab("permissions")}
              className={`pb-3 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === "permissions"
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Role Permissions Matrix</span>
            </button>
          </div>

          {/* Tab 1: Artworks Grid */}
          {activeTab === "artworks" && (
            <div>
              {displayedArtworkIds.length === 0 ? (
                <EmptyState
                  title="No Masterpieces Registered"
                  description="Your collection does not have any minted art tokens yet. Register your first piece with client-side SHA-256 validation."
                  actionHref="/mint"
                  actionLabel="Register Artwork Now"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedArtworkIds.map((id) => (
                    <ArtworkCard key={id} tokenId={id} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Curator Workflows */}
          {activeTab === "tools" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Genesis Provenance Minting
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Certify the creation of an original physical artwork. Produces a tamper-proof ERC-721 token containing the artist credentials and unalterable image hash.
                </p>
                <Link
                  href="/mint"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <span>Go to Registration Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Physical Media Integrity Check
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Verify the physical integrity of a piece prior to acquisition, auction, or insurance underwriting by checking its digital photograph against the sealed record.
                </p>
                <Link
                  href="/verify"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <span>Go to Hash Verification</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Tab 3: Permissions Matrix */}
          {activeTab === "permissions" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-500" />
                  <span>Your Assigned Capabilities</span>
                </h3>
                <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        isArtist || isDefaultAdmin ? "text-emerald-500" : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                    <span className={isArtist || isDefaultAdmin ? "font-semibold text-slate-900 dark:text-white" : ""}>
                      Artwork Registration & Genesis Initialization (Artist)
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        isGallery || isDefaultAdmin ? "text-emerald-500" : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                    <span className={isGallery || isDefaultAdmin ? "font-semibold text-slate-900 dark:text-white" : ""}>
                      Custody Transfers & Exhibition Loans (Gallery)
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        isRestorer || isDefaultAdmin ? "text-emerald-500" : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                    <span className={isRestorer || isDefaultAdmin ? "font-semibold text-slate-900 dark:text-white" : ""}>
                      Conservation Treatments & Condition Reports (Restorer)
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        isAppraiser || isDefaultAdmin ? "text-emerald-500" : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                    <span className={isAppraiser || isDefaultAdmin ? "font-semibold text-slate-900 dark:text-white" : ""}>
                      Official Appraisals & Valuations (Appraiser)
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        isDefaultAdmin ? "text-emerald-500" : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                    <span className={isDefaultAdmin ? "font-semibold text-slate-900 dark:text-white" : ""}>
                      Institutional Access Control & Role Granting (Admin)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-500" />
                  <span>Institutional Credential Inquiries</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Only accredited institutions, recognized restorers, and authorized appraisers are granted signing capabilities. Contact your network administrator if your account requires upgraded permissions.
                </p>
                {isDefaultAdmin && (
                  <div className="pt-2">
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-md"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Manage Institutional Roles</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGate>
  );
}

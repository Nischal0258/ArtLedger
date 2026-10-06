"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAccount, useBalance, useReadContract } from "wagmi";
import {
  User,
  Palette,
  ShieldCheck,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "@/lib/contract";
import { useUserRole } from "@/hooks/useUserRole";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { AddressPill } from "@/components/ui/AddressPill";
import { CopyButton } from "@/components/ui/CopyButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { roleHash, isArtist, isGallery, isRestorer, isAppraiser, isDefaultAdmin } = useUserRole();
  const { data: balanceData } = useBalance({ address });

  const [activeTab, setActiveTab] = useState<"artworks" | "roles">("artworks");

  // Read total supply to iterate
  const { data: totalSupplyData } = useReadContract({
    address: ARTLEDGER_ADDRESS,
    abi: ARTLEDGER_ABI,
    functionName: "totalSupply",
  });

  const totalSupply = totalSupplyData !== undefined ? Number(totalSupplyData) : 0;
  const allIds = Array.from({ length: totalSupply }, (_, i) => i);

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          icon={<Wallet className="w-8 h-8 text-brand-500" />}
          title="Connect Wallet"
          description="Please connect your Web3 wallet to access your artist portfolio, institutional curator badges, and logged activity."
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Profile Header Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-brand-500/20">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Curator Portfolio
              </h1>
              <div className="flex items-center gap-2">
                <AddressPill address={address} chars={6} />
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Balance
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {balanceData ? `${Number(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : "0.00 ETH"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Network
              </span>
              <span className="text-sm font-bold text-emerald-500">
                Sepolia
              </span>
            </div>
          </div>
        </div>

        {/* Roles overview pill strip */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-2">Assigned Roles:</span>
          <RoleBadge roleHash={roleHash} />
          {isDefaultAdmin && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Shield className="w-3 h-3" />
              Contract Administrator
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab("artworks")}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 ${
              activeTab === "artworks"
                ? "border-brand-500 text-brand-600 dark:text-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Registered Artworks ({totalSupply})
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 ${
              activeTab === "roles"
                ? "border-brand-500 text-brand-600 dark:text-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Institutional Permissions
          </button>
        </div>

        {activeTab === "artworks" ? (
          <div>
            {totalSupply === 0 ? (
              <EmptyState
                title="No Artworks Minted Yet"
                description="You haven't minted any fine art tokens yet. Mint your first token with cryptographic SHA-256 validation."
                actionHref="/mint"
                actionLabel="Register Artwork Now"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allIds.map((id) => (
                  <ArtworkCard key={id} tokenId={id} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-500" />
                <span>Your Active Capabilities</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${isArtist || isDefaultAdmin ? "text-emerald-500" : "text-slate-300"}`} />
                  <span>Artwork Minting & Genesis Provenance Initialization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${isGallery || isDefaultAdmin ? "text-emerald-500" : "text-slate-300"}`} />
                  <span>Gallery Loans, Custody Transfers & Storage Relocations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${isRestorer || isDefaultAdmin ? "text-emerald-500" : "text-slate-300"}`} />
                  <span>Conservation Treatments & Structural Restoration Reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${isAppraiser || isDefaultAdmin ? "text-emerald-500" : "text-slate-300"}`} />
                  <span>Official Appraisals, Valuations & Insurance Certifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${isDefaultAdmin ? "text-emerald-500" : "text-slate-300"}`} />
                  <span>Curator Role Granting & Administrative Oversight</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Need Additional Access?</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                If your institution requires permission to log conservation treatments, custody transfers, or appraisal valuations, an administrator can grant roles via the curator management portal.
              </p>
              {isDefaultAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-md"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Open Curator Admin Panel</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
  RefreshCw,
  Landmark,
  Hammer,
  BadgeDollarSign,
} from "lucide-react";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "@/lib/contract";
import { useUserRole } from "@/hooks/useUserRole";
import { useDemoWallet, DEMO_PERSONAS } from "@/lib/demoWallet";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { AddressPill } from "@/components/ui/AddressPill";
import { CopyButton } from "@/components/ui/CopyButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";
import { AuthGate } from "@/components/auth/AuthGate";
import { MOCK_ARTWORKS } from "@/lib/mockArtworks";

// Import Dedicated Role-Specific Dashboard Views
import { ArtistDashboardView } from "@/components/dashboard/ArtistDashboardView";
import { GalleryDashboardView } from "@/components/dashboard/GalleryDashboardView";
import { RestorerDashboardView } from "@/components/dashboard/RestorerDashboardView";
import { AppraiserDashboardView } from "@/components/dashboard/AppraiserDashboardView";
import { AdminDashboardView } from "@/components/dashboard/AdminDashboardView";

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

  const [activeTab, setActiveTab] = useState<"role-console" | "artworks" | "permissions">(
    "role-console"
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

  // Determine current active role name
  const currentRoleName = activePersona?.roleName || (
    isDefaultAdmin
      ? "Admin"
      : isArtist
      ? "Artist"
      : isGallery
      ? "Gallery"
      : isRestorer
      ? "Restorer"
      : isAppraiser
      ? "Appraiser"
      : "Curator"
  );

  return (
    <AuthGate
      title="Curator Dashboard Login"
      description="Connect your Web3 wallet or Virtual Demo Wallet to access your fine art portfolio, institutional provenance actions, and forensic verification tools."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 animate-fade-in">
        {/* Welcome Header Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-lg shadow-brand-500/20 shrink-0">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>Authenticated Curator Portal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {activePersona ? activePersona.name : "Curator Command Center"}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <AddressPill address={address} chars={6} />
                  {activePersona && (
                    <span className="text-xs text-slate-500 font-medium">
                      ({activePersona.roleTitle})
                    </span>
                  )}
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
                  Current Role
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {currentRoleName}
                </span>
              </div>
            </div>
          </div>

          {/* Role Console Quick-Switch Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-brand-500" />
                <span>Test Role-Specific Consoles (1-Click Switch):</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Instantly transforms the dashboard view into that role&apos;s interface
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {DEMO_PERSONAS.map((persona) => {
                const isActive = activePersona?.id === persona.id;
                let roleIcon = <Shield className="w-3.5 h-3.5 text-rose-400" />;
                if (persona.roleName === "Artist") roleIcon = <Palette className="w-3.5 h-3.5 text-purple-400" />;
                if (persona.roleName === "Gallery") roleIcon = <Landmark className="w-3.5 h-3.5 text-blue-400" />;
                if (persona.roleName === "Restorer") roleIcon = <Hammer className="w-3.5 h-3.5 text-emerald-400" />;
                if (persona.roleName === "Appraiser") roleIcon = <BadgeDollarSign className="w-3.5 h-3.5 text-yellow-400" />;

                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => {
                      switchDemoPersona(persona.id);
                      setActiveTab("role-console");
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2 ${
                      isActive
                        ? "border-brand-500 bg-brand-500/10 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40"
                    }`}
                  >
                    <div className="shrink-0">{roleIcon}</div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-800 dark:text-slate-200"}`}>
                        {persona.roleName}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {persona.name.split(" ")[0]}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab("role-console")}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "role-console"
                ? "border-brand-500 text-brand-600 dark:text-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Dedicated {currentRoleName} Console</span>
          </button>
          <button
            onClick={() => setActiveTab("artworks")}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "artworks"
                ? "border-brand-500 text-brand-600 dark:text-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>All Masterpieces ({displayedArtworkIds.length})</span>
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

        {/* TAB 1: DEDICATED ROLE CONSOLE VIEW */}
        {activeTab === "role-console" && (
          <div>
            {currentRoleName === "Artist" && <ArtistDashboardView />}
            {currentRoleName === "Gallery" && <GalleryDashboardView />}
            {currentRoleName === "Restorer" && <RestorerDashboardView />}
            {currentRoleName === "Appraiser" && <AppraiserDashboardView />}
            {currentRoleName === "Admin" && <AdminDashboardView />}
            {!["Artist", "Gallery", "Restorer", "Appraiser", "Admin"].includes(currentRoleName) && (
              <AdminDashboardView />
            )}
          </div>
        )}

        {/* TAB 2: MASTERPIECES REGISTRY */}
        {activeTab === "artworks" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Global Registered Collection
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  On-chain tokens verified with SHA-256 digests and multi-institutional provenance
                </p>
              </div>
              <Link
                href="/explore"
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <span>Full Gallery Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedArtworkIds.map((id) => (
                <ArtworkCard key={id} tokenId={id} />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ROLE PERMISSIONS MATRIX */}
        {activeTab === "permissions" && (
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Cryptographic Access Control Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Each action on ArtLedger is restricted to verified addresses through OpenZeppelin AccessControl.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Institutional Action</th>
                    <th className="py-3 px-4">Artist Role</th>
                    <th className="py-3 px-4">Gallery Role</th>
                    <th className="py-3 px-4">Restorer Role</th>
                    <th className="py-3 px-4">Appraiser Role</th>
                    <th className="py-3 px-4">Contract Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Mint Artwork (Register)
                    </td>
                    <td className="py-3 px-4 text-emerald-500 font-bold">✓ Allowed</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-emerald-500 font-bold">✓ Admin Overwrite</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Record Custody Transfer / Exhibition
                    </td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-emerald-500 font-bold">✓ Allowed</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-emerald-500 font-bold">✓ Admin Overwrite</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Record Conservation & Restoration
                    </td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-emerald-500 font-bold">✓ Allowed</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-emerald-500 font-bold">✓ Admin Overwrite</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Record Appraisal & Market Valuation
                    </td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-emerald-500 font-bold">✓ Allowed</td>
                    <td className="py-3 px-4 text-emerald-500 font-bold">✓ Admin Overwrite</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Assign / Revoke Institutional Roles
                    </td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-slate-400">-</td>
                    <td className="py-3 px-4 text-emerald-500 font-bold">✓ Exclusively Authorized</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AuthGate>
  );
}

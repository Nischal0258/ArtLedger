"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Lock,
  Sparkles,
  Palette,
  Landmark,
  Hammer,
  BadgeDollarSign,
  Shield,
  ArrowRight,
  ExternalLink,
  Users,
  Layers,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "@/lib/contract";
import { useUserRole } from "@/hooks/useUserRole";
import { useDemoWallet, DEMO_PERSONAS } from "@/lib/demoWallet";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";
import { MOCK_ARTWORKS } from "@/lib/mockArtworks";
import { isAddress } from "viem";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";

export function AdminDashboardView() {
  const { isConnected, isDefaultAdmin, roleHash, isDemoMode, switchDemoPersona } = useUserRole();
  const { executeDemoTransaction } = useDemoWallet();

  const [targetAddress, setTargetAddress] = useState("");
  const [selectedRoleType, setSelectedRoleType] = useState<
    "artist" | "gallery" | "restorer" | "appraiser"
  >("gallery");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const handleGrantRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Please connect an administrator wallet");
      return;
    }
    if (!isDefaultAdmin) {
      toast.error("Unauthorized: Only DEFAULT_ADMIN_ROLE can grant roles");
      return;
    }
    if (!isAddress(targetAddress.trim())) {
      toast.error("Invalid Ethereum address provided");
      return;
    }

    setIsSubmitting(true);
    try {
      let functionName:
        | "grantArtistRole"
        | "grantGalleryRole"
        | "grantRestorerRole"
        | "grantAppraiserRole" = "grantGalleryRole";

      if (selectedRoleType === "artist") functionName = "grantArtistRole";
      else if (selectedRoleType === "gallery") functionName = "grantGalleryRole";
      else if (selectedRoleType === "restorer") functionName = "grantRestorerRole";
      else if (selectedRoleType === "appraiser") functionName = "grantAppraiserRole";

      if (isDemoMode) {
        toast.info("Assigning role via Virtual Demo Administrator...");
        await executeDemoTransaction({
          functionName,
          args: [targetAddress.trim() as `0x${string}`],
        });
        setTargetAddress("");
        toast.success(`Institutional role granted successfully!`);
        return;
      }

      await writeContractAsync({
        address: ARTLEDGER_ADDRESS,
        abi: ARTLEDGER_ABI,
        functionName,
        args: [targetAddress.trim() as `0x${string}`],
      });

      setTargetAddress("");
      toast.success(`Institutional role granted on-chain!`);
    } catch (err: any) {
      toast.error(err?.shortMessage || err?.message || "Failed to grant role");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Role Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-rose-500/20 bg-gradient-to-tr from-rose-500/10 via-brand-500/5 to-transparent space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
                Protocol Authority Console
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Root Governance & Registry Admin
              </h2>
            </div>
          </div>

          <Link
            href="/admin"
            className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open Dedicated Role Manager</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          As the ArtLedger Root Administrator, you hold the highest administrative authority (<code className="text-rose-400 font-mono">DEFAULT_ADMIN_ROLE</code>). You authorize trusted cultural institutions, conservators, galleries, and certified appraisers into the decentralized provenance ecosystem.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Entities</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">5 Curators</span>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Masterpieces</span>
            <span className="text-lg font-black text-rose-500">{MOCK_ARTWORKS.length} Minted</span>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Role Access</span>
            <span className="text-lg font-black text-emerald-500">RBAC Verified</span>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Ledger Integrity</span>
            <span className="text-lg font-black text-brand-500">100% Cryptographic</span>
          </div>
        </div>
      </div>

      {/* Main Admin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quick Role Granting */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Grant Institutional Credential
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Assign on-chain permission to a cryptographic address
                </p>
              </div>
            </div>

            <form onSubmit={handleGrantRole} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Ethereum Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="0x..."
                  value={targetAddress}
                  onChange={(e) => setTargetAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Role Authority
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "artist", title: "Artist", icon: Palette, color: "text-purple-400" },
                    { id: "gallery", title: "Gallery", icon: Landmark, color: "text-blue-400" },
                    { id: "restorer", title: "Restorer", icon: Hammer, color: "text-emerald-400" },
                    { id: "appraiser", title: "Appraiser", icon: BadgeDollarSign, color: "text-yellow-400" },
                  ].map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRoleType === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRoleType(role.id as any)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? "border-rose-500 bg-rose-500/10 text-slate-900 dark:text-white"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${role.color}`} />
                        <span className="text-xs font-bold">{role.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isSubmitting ? "Granting Role..." : "Authorize Institutional Role"}</span>
              </button>
            </form>
          </div>

          {/* Institutional Personas Directory */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-500" />
              <span>Certified Curator Directory</span>
            </h3>
            <div className="space-y-2.5">
              {DEMO_PERSONAS.map((persona) => (
                <div
                  key={persona.address}
                  className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold shrink-0">
                      {persona.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {persona.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate font-mono">
                        {persona.address.slice(0, 8)}...{persona.address.slice(-6)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {persona.roleName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTargetAddress(persona.address)}
                      className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 underline"
                    >
                      Autofill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Governance Protocols & Smart Contract Info */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Smart Contract Architecture
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  On-chain security & multi-role configuration
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Contract Address</span>
                <p className="font-mono text-slate-900 dark:text-white break-all">
                  {ARTLEDGER_ADDRESS}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">ERC-721 Standard</span>
                <span className="font-bold text-emerald-500">ERC721Enumerable Compliant</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Access Control Model</span>
                <span className="font-bold text-brand-500">OpenZeppelin AccessControl</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Cryptographic Digest</span>
                <span className="font-bold text-purple-400">SHA-256 Collision Proof</span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Administrative Tools</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/verify"
                className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:border-brand-500/50 hover:bg-brand-500/5 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-brand-500">
                    Forensic Verifier
                  </p>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Inspect digital signatures and hash authenticity
                  </p>
                </div>
                <span className="text-[10px] font-bold text-brand-500 flex items-center gap-1 mt-2">
                  Launch <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
              <Link
                href="/explore"
                className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:border-brand-500/50 hover:bg-brand-500/5 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-brand-500">
                    Registry Explorer
                  </p>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Browse all cataloged museum-grade artworks
                  </p>
                </div>
                <span className="text-[10px] font-bold text-brand-500 flex items-center gap-1 mt-2">
                  Browse <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Registry Overview */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-rose-500" />
              <span>Catalog Masterpieces ({MOCK_ARTWORKS.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete on-chain index under administrative supervision
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
          >
            <span>View All</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_ARTWORKS.slice(0, 4).map((artwork) => (
            <ArtworkCard key={artwork.tokenId} tokenId={artwork.tokenId} />
          ))}
        </div>
      </div>
    </div>
  );
}

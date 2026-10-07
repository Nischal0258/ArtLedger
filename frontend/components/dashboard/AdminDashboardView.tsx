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

interface AdminDashboardViewProps {
  onOpenVerifier?: () => void;
  onOpenPortfolio?: () => void;
  onOpenTimeline?: (tokenId: number) => void;
}

export function AdminDashboardView({
  onOpenVerifier,
  onOpenPortfolio,
  onOpenTimeline,
}: AdminDashboardViewProps = {}) {
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
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-200">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                Protocol Authority Console
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#242633]">
                Root Governance & Registry Admin
              </h2>
            </div>
          </div>

          <Link
            href="/admin"
            className="px-5 py-3 rounded-2xl brand-gradient text-[#242633] font-extrabold text-xs sm:text-sm shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)] flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <ShieldCheck className="w-4 h-4 text-[#242633]" />
            <span>Open Dedicated Role Manager</span>
            <ArrowRight className="w-4 h-4 text-[#242633]" />
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-[#686878] max-w-3xl leading-relaxed">
          As the ArtLedger Root Administrator, you hold the highest administrative authority (<code className="text-[#242633] font-mono bg-white/80 px-1.5 py-0.5 rounded-lg border border-[#EEE8E3]">DEFAULT_ADMIN_ROLE</code>). You authorize trusted cultural institutions, conservators, galleries, and certified appraisers into the decentralized provenance ecosystem.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#686878] block">Active Entities</span>
            <span className="text-lg font-black text-[#242633]">5 Curators</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#686878] block">Masterpieces</span>
            <span className="text-lg font-black text-rose-600">{MOCK_ARTWORKS.length} Minted</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#686878] block">Role Access</span>
            <span className="text-lg font-black text-[#1a7e4e]">RBAC Verified</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#686878] block">Ledger Integrity</span>
            <span className="text-lg font-black text-[#DBBA95]">100% Cryptographic</span>
          </div>
        </div>
      </div>

      {/* Main Admin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quick Role Granting */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl glass-panel space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-200">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#242633]">
                  Grant Institutional Credential
                </h3>
                <p className="text-xs text-[#686878]">
                  Assign on-chain permission to a cryptographic address
                </p>
              </div>
            </div>

            <form onSubmit={handleGrantRole} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#434553]">
                  Target Ethereum Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="0x..."
                  value={targetAddress}
                  onChange={(e) => setTargetAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE8E3] bg-white/80 text-xs sm:text-sm font-mono text-[#242633] placeholder:text-[#686878]/60 focus:outline-none focus:ring-2 focus:ring-[#FABED7]/40 focus:border-[#F07BAF]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#434553]">
                  Select Role Authority
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "artist", title: "Artist", icon: Palette, color: "text-[#F07BAF]" },
                    { id: "gallery", title: "Gallery", icon: Landmark, color: "text-[#DBBA95]" },
                    { id: "restorer", title: "Restorer", icon: Hammer, color: "text-[#49C98A]" },
                    { id: "appraiser", title: "Appraiser", icon: BadgeDollarSign, color: "text-[#F5A623]" },
                  ].map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRoleType === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRoleType(role.id as any)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? "border-[#F07BAF] bg-[#FABED7]/20 text-[#242633] ring-1 ring-[#F07BAF]"
                            : "border-[#EEE8E3] hover:border-[#DBBA95] bg-white/70 text-[#686878]"
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
                className="w-full py-3 rounded-2xl brand-gradient hover:opacity-95 text-[#242633] font-extrabold text-xs sm:text-sm shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01]"
              >
                <UserPlus className="w-4 h-4 text-[#242633]" />
                <span>{isSubmitting ? "Granting Role..." : "Authorize Institutional Role"}</span>
              </button>
            </form>
          </div>

          {/* Institutional Personas Directory */}
          <div className="p-6 rounded-3xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-[#242633] flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-600" />
              <span>Certified Curator Directory</span>
            </h3>
            <div className="space-y-2.5">
              {DEMO_PERSONAS.map((persona) => (
                <div
                  key={persona.address}
                  className="p-3 rounded-2xl border border-[#EEE8E3] bg-white/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl brand-gradient text-[#242633] flex items-center justify-center font-bold shrink-0">
                      {persona.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#242633] truncate">
                        {persona.name}
                      </p>
                      <p className="text-[10px] text-[#686878] truncate font-mono">
                        {persona.address.slice(0, 8)}...{persona.address.slice(-6)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7F3F0] text-[#434553] border border-[#EEE8E3]">
                      {persona.roleName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTargetAddress(persona.address)}
                      className="text-[11px] font-bold text-[#F07BAF] hover:text-[#242633] transition-colors"
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
          <div className="p-6 rounded-3xl glass-panel space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl brand-gradient text-[#242633] flex items-center justify-center font-bold shadow-xs">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#242633]">
                  Smart Contract Architecture
                </h3>
                <p className="text-xs text-[#686878]">
                  On-chain security & multi-role configuration
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-white/80 border border-[#EEE8E3] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#686878]">Contract Address</span>
                <p className="font-mono text-[#242633] break-all font-semibold">
                  {ARTLEDGER_ADDRESS}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-[#EEE8E3] flex justify-between items-center">
                <span className="text-[#686878]">ERC-721 Standard</span>
                <span className="font-bold text-[#1a7e4e]">ERC721Enumerable Compliant</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-[#EEE8E3] flex justify-between items-center">
                <span className="text-[#686878]">Access Control Model</span>
                <span className="font-bold text-[#855e30]">OpenZeppelin AccessControl</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-[#EEE8E3] flex justify-between items-center">
                <span className="text-[#686878]">Cryptographic Digest</span>
                <span className="font-bold text-[#a8245e]">SHA-256 Collision Proof</span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-6 rounded-3xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-[#242633] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F07BAF]" />
              <span>Administrative Tools</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onOpenVerifier) onOpenVerifier();
                }}
                className="p-4 rounded-2xl border border-[#EEE8E3] bg-white/80 hover:border-[#F07BAF] transition-all group flex flex-col justify-between shadow-xs text-left cursor-pointer"
              >
                <div className="space-y-1">
                  <p className="font-bold text-xs text-[#242633] group-hover:text-[#F07BAF]">
                    Forensic Verifier
                  </p>
                  <p className="text-[11px] text-[#686878] leading-snug">
                    Inspect digital signatures and hash authenticity
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#F07BAF] flex items-center gap-1 mt-3">
                  Launch <ArrowRight className="w-3 h-3" />
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onOpenPortfolio) onOpenPortfolio();
                }}
                className="p-4 rounded-2xl border border-[#EEE8E3] bg-white/80 hover:border-[#F07BAF] transition-all group flex flex-col justify-between shadow-xs text-left cursor-pointer"
              >
                <div className="space-y-1">
                  <p className="font-bold text-xs text-[#242633] group-hover:text-[#F07BAF]">
                    Registry Explorer
                  </p>
                  <p className="text-[11px] text-[#686878] leading-snug">
                    Browse all cataloged museum-grade artworks
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#F07BAF] flex items-center gap-1 mt-3">
                  Browse <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Registry Overview */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-[#242633] flex items-center gap-2">
              <Layers className="w-5 h-5 text-rose-600" />
              <span>Catalog Masterpieces ({MOCK_ARTWORKS.length})</span>
            </h3>
            <p className="text-xs text-[#686878]">
              Complete on-chain index under administrative supervision
            </p>
          </div>
          {onOpenPortfolio && (
            <button
              type="button"
              onClick={onOpenPortfolio}
              className="text-xs font-bold text-[#F07BAF] hover:text-[#242633] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_ARTWORKS.slice(0, 4).map((artwork) => (
            <ArtworkCard
              key={artwork.tokenId}
              tokenId={artwork.tokenId}
              onSelect={onOpenTimeline}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

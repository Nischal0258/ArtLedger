"use client";

import React, { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { isAddress } from "viem";
import { toast } from "sonner";
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
} from "lucide-react";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "@/lib/contract";
import { useUserRole } from "@/hooks/useUserRole";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { RoleBadge } from "@/components/ui/RoleBadge";

export default function AdminPage() {
  const { isConnected } = useAccount();
  const { isDefaultAdmin, roleHash } = useUserRole();

  const [targetAddress, setTargetAddress] = useState("");
  const [selectedRoleType, setSelectedRoleType] = useState<
    "artist" | "gallery" | "restorer" | "appraiser"
  >("gallery");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { data: hash, writeContractAsync, isPending: isWriting } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Please connect an administrator wallet");
      return;
    }
    if (!isDefaultAdmin) {
      toast.error("Unauthorized: Only the contract administrator can grant roles");
      return;
    }
    if (!isAddress(targetAddress.trim())) {
      toast.error("Invalid Ethereum address provided");
      return;
    }
    setIsConfirmOpen(true);
  };

  const executeGrantRole = async () => {
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

      await writeContractAsync({
        address: ARTLEDGER_ADDRESS,
        abi: ARTLEDGER_ABI,
        functionName,
        args: [targetAddress.trim() as `0x${string}`],
      });

      setIsConfirmOpen(false);
      setTargetAddress("");
      toast.success(`Role successfully assigned on-chain!`);
    } catch (err: any) {
      toast.error(err?.shortMessage || err?.message || "Failed to grant role");
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-semibold mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>Institutional Governance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          Curator Role Management
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Admin portal to grant verified credentials to Artists, Galleries, Conservators, and Certified Appraisers.
        </p>
      </div>

      {/* Admin Guard Alert */}
      {isConnected && !isDefaultAdmin && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold mb-1">Administrative Privileges Required</p>
            <p>
              Your connected wallet currently holds:{" "}
              <RoleBadge roleHash={roleHash} className="ml-1" />.
              Only the `DEFAULT_ADMIN_ROLE` (contract deployer) is authorized to assign new institutional credentials.
            </p>
          </div>
        </div>
      )}

      {/* Role Assignment Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
          <UserPlus className="w-5 h-5 text-brand-500" />
          <span>Grant New Institution Role</span>
        </h2>

        <form onSubmit={handleGrantSubmit} className="space-y-5">
          {/* Target Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Recipient Ethereum Address *
            </label>
            <input
              type="text"
              required
              placeholder="0x..."
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Role Selector Grid */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Role Authority *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "artist",
                  title: "Artist Role",
                  icon: Palette,
                  color: "text-purple-400",
                  desc: "Authorized to mint artworks and establish genesis records.",
                },
                {
                  id: "gallery",
                  title: "Gallery Role",
                  icon: Landmark,
                  color: "text-blue-400",
                  desc: "Record custody transfers, loans, and exhibitions.",
                },
                {
                  id: "restorer",
                  title: "Restorer Role",
                  icon: Hammer,
                  color: "text-emerald-400",
                  desc: "Record conservation treatments and condition audits.",
                },
                {
                  id: "appraiser",
                  title: "Appraiser Role",
                  icon: BadgeDollarSign,
                  color: "text-amber-400",
                  desc: "Log verified valuations and authenticity appraisals.",
                },
              ].map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRoleType === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRoleType(role.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "border-brand-500 bg-brand-500/5 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${role.color}`} />
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {role.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {role.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isConnected || isWriting || isConfirming || (!isDefaultAdmin && isConnected)}
              className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isWriting || isConfirming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Granting Role on Ledger...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Grant Role Credential</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeGrantRole}
        title="Confirm Role Authority Grant"
        description="You are granting institutional write privileges on the ArtLedger contract. This address will have authority to log on-chain provenance records."
        confirmLabel="Confirm Role Assignment"
        isPending={isWriting || isConfirming}
        details={[
          { label: "Target Account", value: targetAddress },
          { label: "Role Authority", value: selectedRoleType.toUpperCase() },
        ]}
      />
    </div>
  );
}

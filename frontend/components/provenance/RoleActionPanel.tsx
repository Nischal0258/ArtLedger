"use client";

import React, { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { toast } from "sonner";
import {
  FileEdit,
  ShieldAlert,
  Sparkles,
  MapPin,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "@/lib/contract";
import { EventType, EVENT_METADATA } from "@/lib/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface RoleActionPanelProps {
  tokenId: number | bigint | string;
  onEventLogged?: () => void;
}

export function RoleActionPanel({ tokenId, onEventLogged }: RoleActionPanelProps) {
  const { isConnected } = useAccount();
  const { roleHash, hasAnyRole } = useUserRole();

  const [eventType, setEventType] = useState<EventType>(EventType.CustodyTransfer);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { data: hash, writeContractAsync, isPending: isWriting } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Please connect your curator wallet");
      return;
    }
    if (!hasAnyRole) {
      toast.error("Unauthorized: Your address lacks an approved curator role");
      return;
    }
    if (!description.trim()) {
      toast.error("Please provide a description of the event");
      return;
    }
    setIsConfirmOpen(true);
  };

  const executeEventLog = async () => {
    try {
      await writeContractAsync({
        address: ARTLEDGER_ADDRESS,
        abi: ARTLEDGER_ABI,
        functionName: "logCustodyEvent",
        args: [
          BigInt(tokenId),
          Number(eventType),
          description.trim(),
          location.trim() || "Not Disclosed",
        ],
      });

      setIsConfirmOpen(false);
      setDescription("");
      setLocation("");
      toast.success("Custody event broadcasted to ArtLedger!");
      if (onEventLogged) onEventLogged();
    } catch (err: any) {
      toast.error(err?.shortMessage || err?.message || "Failed to log custody event");
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <FileEdit className="w-4 h-4 text-brand-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Curator Action Panel
          </h3>
        </div>
        <RoleBadge roleHash={roleHash} />
      </div>

      {!isConnected ? (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <Lock className="w-5 h-5 mx-auto text-slate-400" />
          <p className="text-xs text-slate-500">
            Connect an authorized curator or institution wallet to log custody, restoration, or appraisal records.
          </p>
        </div>
      ) : !hasAnyRole ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Unauthorized Curator Notice</span>
          </div>
          <p className="text-xs leading-relaxed">
            Your connected address does not currently have an authorized curator role (Gallery, Restorer, or Appraiser). Any attempt to log an event will be rejected by the smart contract.
          </p>
        </div>
      ) : (
        <form onSubmit={handleActionSubmit} className="space-y-4">
          {/* Event Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Event Classification *
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(Number(e.target.value) as EventType)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value={EventType.CustodyTransfer}>Custody Transfer (Ownership / Acquisition)</option>
              <option value={EventType.Exhibition}>Exhibition Loan (Museum / Gallery Display)</option>
              <option value={EventType.Restoration}>Restoration Work (Conservation / Stabilization)</option>
              <option value={EventType.Appraisal}>Appraisal & Valuation (Insurance Audit)</option>
              <option value={EventType.StorageUpdate}>Storage Relocation (Vault Transfer)</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Event Details & Documentation *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive report summary, condition notes, or contract ID..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Physical Location / Facility
            </label>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Louvre Conservation Lab, Paris"
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isWriting || isConfirming}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
          >
            {isWriting || isConfirming ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Appending to Ledger...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Log Authenticated Event</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeEventLog}
        title="Confirm Provenance Record"
        description="This event will be sealed on the Ethereum blockchain under your institutional authority. It cannot be altered or removed."
        confirmLabel="Confirm & Sign"
        isPending={isWriting || isConfirming}
        details={[
          { label: "Token ID", value: `#${tokenId.toString()}` },
          { label: "Event Type", value: EVENT_METADATA[eventType]?.title || "Event" },
          { label: "Facility", value: location || "Default" },
        ]}
      />
    </div>
  );
}

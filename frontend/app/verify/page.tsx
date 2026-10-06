"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useReadContract } from "wagmi";
import {
  ShieldCheck,
  ShieldAlert,
  Upload,
  Search,
  CheckCircle2,
  XCircle,
  FileSearch,
  Sparkles,
  Fingerprint,
} from "lucide-react";
import { toast } from "sonner";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "@/lib/contract";
import { useArtwork } from "@/hooks/useArtwork";
import { computeSHA256 } from "@/lib/hash";
import { truncateHash } from "@/lib/formatters";
import { CopyButton } from "@/components/ui/CopyButton";

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [tokenIdInput, setTokenIdInput] = useState(initialId);
  const [activeTokenId, setActiveTokenId] = useState<bigint | undefined>(
    initialId !== "" ? BigInt(initialId) : undefined
  );

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [computedHash, setComputedHash] = useState<`0x${string}` | "">("");
  const [isHashing, setIsHashing] = useState(false);

  const { artwork, isLoading: isArtworkLoading } = useArtwork(
    activeTokenId !== undefined ? activeTokenId.toString() : undefined
  );

  // Contract verification call
  const { data: isMatch, isLoading: isVerifying } = useReadContract({
    address: ARTLEDGER_ADDRESS,
    abi: ARTLEDGER_ABI,
    functionName: "verifyImageHash",
    args:
      activeTokenId !== undefined && computedHash !== ""
        ? [activeTokenId, computedHash as `0x${string}`]
        : undefined,
    query: {
      enabled: activeTokenId !== undefined && computedHash !== "",
    },
  });

  const handleTokenSelect = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenIdInput.trim() !== "") {
      setActiveTokenId(BigInt(tokenIdInput.trim()));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setFilePreview(URL.createObjectURL(selected));
      setIsHashing(true);

      try {
        const hash = await computeSHA256(selected);
        setComputedHash(hash);
        toast.info("Image SHA-256 fingerprint computed");
      } catch {
        toast.error("Failed to hash image");
      } finally {
        setIsHashing(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center sm:text-left space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero-Trust Verification Utility</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Verify Artwork Authenticity
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Upload any photograph or digital file of an artwork to verify its cryptographic SHA-256 fingerprint against the registered on-chain token.
        </p>
      </div>

      {/* Target Artwork Lookup */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Search className="w-4 h-4 text-brand-500" />
          <span>1. Select Target Token Record</span>
        </h2>

        <form onSubmit={handleTokenSelect} className="flex gap-3">
          <input
            type="number"
            min="0"
            placeholder="Enter Token ID (e.g. 0)..."
            value={tokenIdInput}
            onChange={(e) => setTokenIdInput(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
          >
            Load Record
          </button>
        </form>

        {activeTokenId !== undefined && artwork && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                {artwork.title}
              </span>
              <span className="text-slate-500">
                By {artwork.artistName} ({artwork.year})
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                Registered On-Chain Hash
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {truncateHash(artwork.imageHash, 6)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Upload File to Test */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Upload className="w-4 h-4 text-brand-500" />
          <span>2. Upload Candidate Image for Forensic Check</span>
        </h2>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 rounded-xl p-8 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/40">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="sr-only"
          />
          {filePreview ? (
            <div className="space-y-3 text-center">
              <img
                src={filePreview}
                alt="Uploaded Candidate"
                className="w-48 h-48 object-cover rounded-xl shadow mx-auto"
              />
              <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                Click to select a different file
              </span>
            </div>
          ) : (
            <div className="text-center space-y-2 py-4">
              <Fingerprint className="w-10 h-10 mx-auto text-slate-400" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Drop candidate image here or click to browse
              </p>
              <p className="text-xs text-slate-400">
                File is processed client-side. No images are uploaded to any server during verification.
              </p>
            </div>
          )}
        </label>

        {computedHash && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Calculated Candidate Hash
              </span>
              <CopyButton textToCopy={computedHash} label="Copy Hash" />
            </div>
            <div className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
              {computedHash}
            </div>
          </div>
        )}
      </div>

      {/* Verification Results Banner */}
      {activeTokenId !== undefined && computedHash !== "" && (
        <div className="animate-fade-in">
          {isVerifying ? (
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Querying ArtLedger smart contract...
              </p>
            </div>
          ) : isMatch ? (
            <div className="p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-emerald-900 dark:text-white">
                    VERIFIED AUTHENTIC ORIGINAL
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300">
                    Cryptographic match confirmed on Ethereum Sepolia ledger.
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-emerald-800 dark:text-emerald-200">
                The SHA-256 fingerprint of your uploaded file exactly matches the immutable hash recorded at initial registration for Token #{activeTokenId.toString()} ({artwork?.title}).
              </p>
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-3xl border border-rose-500/30 bg-rose-500/10 text-rose-950 dark:text-rose-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
                  <XCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-rose-900 dark:text-white">
                    HASH MISMATCH DETECTED
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300">
                    The uploaded image does not match the registered on-chain record.
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-rose-800 dark:text-rose-200">
                Warning: The tested file possesses a different cryptographic hash than the token record. This could indicate a modified image, compression alteration, or an unauthenticated counterfeit reproduction.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}

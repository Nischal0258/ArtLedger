"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  Upload,
  CheckCircle2,
  Sparkles,
  Palette,
  ShieldAlert,
  ArrowRight,
  FileCheck2,
  Image as ImageIcon,
  Lock,
} from "lucide-react";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "@/lib/contract";
import { useUserRole } from "@/hooks/useUserRole";
import { computeSHA256 } from "@/lib/hash";
import { truncateHash } from "@/lib/formatters";
import { CopyButton } from "@/components/ui/CopyButton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { RoleBadge } from "@/components/ui/RoleBadge";

export default function MintPage() {
  const { isConnected } = useAccount();
  const { isArtist, isDefaultAdmin, roleHash } = useUserRole();

  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [imageHash, setImageHash] = useState<`0x${string}` | "">("");
  const [isHashing, setIsHashing] = useState(false);

  const [artistName, setArtistName] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [medium, setMedium] = useState("Oil on Canvas");
  const [ipfsCID, setIpfsCID] = useState("QmArtLedgerDefaultCID00000000000000000000000000");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null);

  // Wagmi Write Hook
  const { data: hash, writeContractAsync, isPending: isWriting } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle Image Selection & SHA-256 Hashing
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setFilePreview(URL.createObjectURL(selected));
      setIsHashing(true);

      try {
        const computed = await computeSHA256(selected);
        setImageHash(computed);
        toast.success("SHA-256 fingerprint generated!");
      } catch (err) {
        toast.error("Failed to compute image hash");
      } finally {
        setIsHashing(false);
      }
    }
  };

  const handleMintSubmit = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (!imageHash) {
      toast.error("Please upload an artwork file to generate cryptographic hash");
      return;
    }
    if (!artistName.trim() || !title.trim()) {
      toast.error("Please complete all required artwork details");
      return;
    }

    setIsConfirmOpen(true);
  };

  const executeMint = async () => {
    try {
      const tokenURI = `ipfs://${ipfsCID}/metadata.json`;

      const tx = await writeContractAsync({
        address: ARTLEDGER_ADDRESS,
        abi: ARTLEDGER_ABI,
        functionName: "mintArtwork",
        args: [
          artistName.trim(),
          title.trim(),
          Number(year),
          medium.trim(),
          imageHash as `0x${string}`,
          ipfsCID.trim(),
          tokenURI,
        ],
      });

      setIsConfirmOpen(false);
      toast.info("Transaction broadcasted! Awaiting confirmation...");
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      setMintedTokenId(0); // Will link to latest or 0
    } catch (err: any) {
      toast.error(err?.shortMessage || err?.message || "Minting transaction failed");
      setIsConfirmOpen(false);
    }
  };

  const canMint = isArtist || isDefaultAdmin;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20 text-xs font-semibold mb-3">
          <Palette className="w-3.5 h-3.5" />
          <span>Artist Registry Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Register New Artwork
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Mint an ERC-721 provenance token permanently binding the artist&apos;s identity, physical dimensions, and cryptographic SHA-256 media fingerprint.
        </p>
      </div>

      {/* Role Check Warning */}
      {isConnected && !canMint && (
        <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold mb-1">Artist Role Required</p>
            <p>
              Your connected wallet currently has the role:{" "}
              <RoleBadge roleHash={roleHash} className="ml-1" />.
              Only verified artists or admins can register new artworks. You can request the Artist role from the curator in the Admin portal.
            </p>
          </div>
        </div>
      )}

      {/* Mint Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: File Upload & Cryptographic Hashing */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Upload className="w-4 h-4 text-brand-500" />
              <span>Artwork File & Hash</span>
            </h2>

            {/* Dropzone */}
            <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 rounded-xl p-6 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/40">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
              {filePreview ? (
                <div className="w-full space-y-3 text-center">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-full aspect-square object-cover rounded-lg shadow-sm"
                  />
                  <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                    Click to replace file
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Upload High-Res Artwork
                  </span>
                  <span className="text-xs text-slate-400">
                    PNG, JPG, or WEBP (Max 25MB)
                  </span>
                </div>
              )}
            </label>

            {/* Hash Display */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[10px]">
                  SHA-256 Digest
                </span>
                {imageHash && <CopyButton textToCopy={imageHash} label="Copy Hash" />}
              </div>
              <div className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
                {isHashing
                  ? "Computing cryptographic hash in browser..."
                  : imageHash
                  ? imageHash
                  : "Upload an image above to generate hash"}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Metadata Inputs */}
        <div className="lg:col-span-7">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleMintSubmit();
            }}
            className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5"
          >
            <h2 className="text-base font-bold flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-brand-500" />
              <span>Provenance Metadata</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Artwork Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Starry Night Over the Rhône"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Artist Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Primary Artist Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vincent van Gogh"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Year of Completion *
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  max={new Date().getFullYear() + 1}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Medium */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Medium *
                </label>
                <select
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="Oil on Canvas">Oil on Canvas</option>
                  <option value="Acrylic on Linen">Acrylic on Linen</option>
                  <option value="Watercolor on Paper">Watercolor on Paper</option>
                  <option value="Bronze Sculpture">Bronze Sculpture</option>
                  <option value="Digital 3D Composite">Digital 3D Composite</option>
                  <option value="Mixed Media">Mixed Media</option>
                </select>
              </div>

              {/* IPFS CID */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Storage IPFS CID
                </label>
                <input
                  type="text"
                  value={ipfsCID}
                  onChange={(e) => setIpfsCID(e.target.value)}
                  placeholder="Qm..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="submit"
                disabled={!isConnected || isWriting || isConfirming || !imageHash}
                className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
              >
                {isWriting || isConfirming ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing Transaction...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Sign & Mint Provenance NFT</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeMint}
        title="Confirm Artwork Minting"
        description="You are registering this artwork on ArtLedger. This will generate a unique ERC-721 token and initialize its immutable provenance timeline."
        confirmLabel="Broadcast to Ledger"
        isPending={isWriting || isConfirming}
        details={[
          { label: "Title", value: title },
          { label: "Artist", value: artistName },
          { label: "Year & Medium", value: `${year} • ${medium}` },
          { label: "SHA-256", value: truncateHash(imageHash, 8) },
        ]}
      />

      {/* Post-Mint Celebration Card */}
      {isSuccess && (
        <div className="mt-12 p-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Artwork Successfully Registered!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Your artwork has been minted with genesis provenance on the blockchain. You can now view its public timeline or generate its physical QR label.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/explore"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-md"
            >
              View in Gallery
            </Link>
            <button
              onClick={() => {
                setFile(null);
                setFilePreview(null);
                setImageHash("");
                setTitle("");
                setArtistName("");
              }}
              className="px-5 py-2.5 rounded-xl border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:bg-emerald-500/10 transition-colors"
            >
              Mint Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

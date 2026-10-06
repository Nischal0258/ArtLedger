"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Palette,
  Sparkles,
  ArrowRight,
  FileCheck2,
  Upload,
  CheckCircle2,
  Layers,
  Copy,
  ExternalLink,
} from "lucide-react";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";
import { MOCK_ARTWORKS } from "@/lib/mockArtworks";
import { computeSHA256 } from "@/lib/hash";
import { toast } from "sonner";

export function ArtistDashboardView() {
  const [testFile, setTestFile] = useState<File | null>(null);
  const [testHash, setTestHash] = useState<string>("");
  const [isHashing, setIsHashing] = useState<boolean>(false);

  // Artist's minted creations
  const artistArtworks = MOCK_ARTWORKS.filter((a) =>
    ["Girl with a Pearl Earring", "The Starry Night", "The Kiss (Der Kuss)", "The Thinker (Le Penseur)"].includes(a.title)
  );

  const handleFileHash = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTestFile(file);
    setIsHashing(true);
    try {
      const hash = await computeSHA256(file);
      setTestHash(hash);
      toast.success("SHA-256 fingerprint generated successfully!");
    } catch {
      toast.error("Failed to hash file");
    } finally {
      setIsHashing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Role Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-purple-500/20 bg-gradient-to-tr from-purple-500/10 via-brand-500/5 to-transparent space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                Creator Role Console
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Genesis Artist Studio
              </h2>
            </div>
          </div>

          <Link
            href="/mint"
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Artwork Registration Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          As a verified Artist on ArtLedger, you possess cryptographically privileged rights to register original physical artworks, bind client-side SHA-256 image hashes directly into smart contract bytecode, and upload decentralized metadata.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Registered Creations</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">{artistArtworks.length} Masterpieces</span>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Hash Integrity</span>
            <span className="text-lg font-bold text-emerald-500">100% Sealed</span>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">IPFS Gateway</span>
            <span className="text-lg font-bold text-purple-400">Pinata Active</span>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Signing Authority</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">ARTIST_ROLE</span>
          </div>
        </div>
      </div>

      {/* Artist Studio Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tool 1: Registration Portal */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Genesis Minting Wizard
              </h3>
              <p className="text-xs text-slate-500">
                Full 4-step registration pipeline
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Attach high-resolution digital photograph, auto-generate SHA-256 digest, upload IPFS metadata, and mint immutable ERC-721 token on Ethereum.
          </p>
          <Link
            href="/mint"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors text-slate-900 dark:text-white"
          >
            <span>Open Registration Form</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tool 2: Client-side SHA-256 Digest Tester */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Pre-Mint SHA-256 Diagnostic
              </h3>
              <p className="text-xs text-slate-500">
                Instant browser cryptographic calculation
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Test Artwork File:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileHash}
              className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-500/10 file:text-brand-500 hover:file:bg-brand-500/20"
            />
          </div>
          {testHash && (
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono block">SHA-256 Seal Digest:</span>
              <span className="text-[11px] font-mono font-bold text-brand-600 dark:text-brand-400 break-all block">
                {testHash}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Artist's Registered Works */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>My Registered Masterpieces ({artistArtworks.length})</span>
          </h3>
          <Link
            href="/explore"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            View All in Public Explorer →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {artistArtworks.map((a) => (
            <ArtworkCard key={a.tokenId} tokenId={a.tokenId} />
          ))}
        </div>
      </div>
    </div>
  );
}

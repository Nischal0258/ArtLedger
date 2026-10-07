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
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl brand-gradient text-[#242633] flex items-center justify-center font-bold shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)]">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F07BAF] block">
                Creator Role Console
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#242633]">
                Genesis Artist Studio
              </h2>
            </div>
          </div>

          <Link
            href="/mint"
            className="px-5 py-3 rounded-2xl brand-gradient text-[#242633] font-extrabold text-xs sm:text-sm shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)] flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-[#242633]" />
            <span>Launch Artwork Registration Wizard</span>
            <ArrowRight className="w-4 h-4 text-[#242633]" />
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-[#686878] max-w-3xl leading-relaxed">
          As a verified Artist on ArtLedger, you possess cryptographically privileged rights to register original physical artworks, bind client-side SHA-256 image hashes directly into smart contract bytecode, and upload decentralized metadata.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] text-[#686878] uppercase font-bold block">Registered Creations</span>
            <span className="text-lg font-bold text-[#242633]">{artistArtworks.length} Masterpieces</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] text-[#686878] uppercase font-bold block">Hash Integrity</span>
            <span className="text-lg font-bold text-[#1a7e4e]">100% Sealed</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] text-[#686878] uppercase font-bold block">IPFS Gateway</span>
            <span className="text-lg font-bold text-[#DBBA95]">Pinata Active</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] text-[#686878] uppercase font-bold block">Signing Authority</span>
            <span className="text-lg font-bold text-[#242633]">ARTIST_ROLE</span>
          </div>
        </div>
      </div>

      {/* Artist Studio Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tool 1: Registration Portal */}
        <div className="p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl brand-gradient text-[#242633] shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#242633]">
                Genesis Minting Wizard
              </h3>
              <p className="text-xs text-[#686878]">
                Full 4-step registration pipeline
              </p>
            </div>
          </div>
          <p className="text-xs text-[#686878] leading-relaxed">
            Attach high-resolution digital photograph, auto-generate SHA-256 digest, upload IPFS metadata, and mint immutable ERC-721 token on Ethereum.
          </p>
          <Link
            href="/mint"
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#F7F3F0] border border-[#EEE8E3] font-bold text-xs flex items-center justify-center gap-2 transition-colors text-[#242633] shadow-xs"
          >
            <span>Open Registration Form</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#686878]" />
          </Link>
        </div>

        {/* Tool 2: Client-side SHA-256 Digest Tester */}
        <div className="p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#DBBA95]/20 text-[#855e30]">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#242633]">
                Pre-Mint SHA-256 Diagnostic
              </h3>
              <p className="text-xs text-[#686878]">
                Instant browser cryptographic calculation
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#434553]">
              Test Artwork File:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileHash}
              className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#DBBA95]/20 file:text-[#855e30] hover:file:bg-[#DBBA95]/30 cursor-pointer"
            />
          </div>
          {testHash && (
            <div className="p-3 rounded-2xl bg-white/90 border border-[#EEE8E3] space-y-1">
              <span className="text-[10px] text-[#686878] font-mono block">SHA-256 Seal Digest:</span>
              <span className="text-[11px] font-mono font-bold text-[#F07BAF] break-all block">
                {testHash}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Artist's Registered Works */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#242633] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F07BAF]" />
            <span>My Registered Masterpieces ({artistArtworks.length})</span>
          </h3>
          <Link
            href="/explore"
            className="text-xs font-bold text-[#F07BAF] hover:text-[#242633] transition-colors"
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

"use client";

import React, { useState } from "react";
import {
  Hammer,
  ShieldCheck,
  FileSearch,
  Sparkles,
  ArrowRight,
  Microscope,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";
import { MOCK_ARTWORKS } from "@/lib/mockArtworks";
import { toast } from "sonner";

interface RestorerDashboardViewProps {
  onOpenVerifier?: () => void;
  onOpenTimeline?: (tokenId: number) => void;
  onOpenPortfolio?: () => void;
  onLogRestorationAction?: (tokenId: number, treatmentType: string) => void;
}

export function RestorerDashboardView({
  onOpenVerifier,
  onOpenTimeline,
  onOpenPortfolio,
  onLogRestorationAction,
}: RestorerDashboardViewProps) {
  const [selectedTokenId, setSelectedTokenId] = useState<number>(0);

  // Artworks with conservation or restoration history
  const restoredArtworks = MOCK_ARTWORKS.filter((a) =>
    [
      "Salvator Mundi",
      "The Starry Night",
      "The Thinker (Le Penseur)",
      "Girl with a Pearl Earring",
      "The Night Watch",
    ].includes(a.title)
  );

  const handleAction = (treatmentType: string) => {
    if (onLogRestorationAction) {
      onLogRestorationAction(selectedTokenId, treatmentType);
    } else {
      toast.success(
        `Restoration treatment "${treatmentType}" recorded on Ethereum for Token #${selectedTokenId}!`
      );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Role Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#49C98A]/20 text-[#1a7e4e] flex items-center justify-center font-bold">
              <Hammer className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a7e4e] block">
                Scientific Diagnostics Console
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#242633]">
                Forensic Conservation & Restoration Lab
              </h2>
            </div>
          </div>

          {onOpenVerifier && (
            <button
              type="button"
              onClick={onOpenVerifier}
              className="px-5 py-3 rounded-2xl brand-gradient text-[#242633] font-extrabold text-xs sm:text-sm shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)] flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <FileSearch className="w-4 h-4 text-[#242633]" />
              <span>Launch Forensic SHA-256 Verifier</span>
              <ArrowRight className="w-4 h-4 text-[#242633]" />
            </button>
          )}
        </div>

        <p className="text-xs sm:text-sm text-[#686878] max-w-3xl leading-relaxed">
          As a certified Master Conservator and Art Restorer, you are empowered to perform forensic integrity checks prior to treatment, issue scientific condition reports, and anchor chemical restoration logs permanently onto the blockchain.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] text-[#686878] uppercase font-bold block">Conserved Masterpieces</span>
            <span className="text-lg font-bold text-[#242633]">{restoredArtworks.length} Pieces</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] text-[#686878] uppercase font-bold block">Condition Reports Issued</span>
            <span className="text-lg font-bold text-[#1a7e4e]">14 Verified</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] text-[#686878] uppercase font-bold block">Forensic Integrity Rate</span>
            <span className="text-lg font-bold text-[#242633]">100% Unaltered</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] text-[#686878] uppercase font-bold block">Signing Authority</span>
            <span className="text-lg font-bold text-[#242633]">RESTORER_ROLE</span>
          </div>
        </div>
      </div>

      {/* Conservator Action Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Action 1: Pre-Restoration Forensic Check */}
        <div className="p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-2.5 rounded-2xl bg-[#DBBA95]/20 text-[#855e30] w-fit">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#242633]">
                Pre-Treatment Forensic Check
              </h3>
              <p className="text-xs text-[#686878]">
                Zero-Trust Authenticity Audit
              </p>
            </div>
            <p className="text-xs text-[#686878] leading-relaxed">
              Verify the physical artwork against the immutable genesis SHA-256 seal before admitting into the conservation cleanroom.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onOpenVerifier) onOpenVerifier();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#F7F3F0] border border-[#EEE8E3] font-bold text-xs flex items-center justify-center gap-2 transition-colors text-[#242633] shadow-xs cursor-pointer"
          >
            <span>Open Forensic Verifier</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#686878]" />
          </button>
        </div>

        {/* Action 2: Condition & Treatment Log */}
        <div className="p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-2.5 rounded-2xl bg-[#49C98A]/15 text-[#1a7e4e] w-fit">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#242633]">
                Log Restoration Treatment
              </h3>
              <p className="text-xs text-[#686878]">
                Varnish, Relining & Pigments
              </p>
            </div>
            <p className="text-xs text-[#686878] leading-relaxed">
              Record chemical treatments, aged varnish removal, structural consolidation, and non-destructive surface cleaning on-chain.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleAction("Varnish Stabilization & Cleaning")}
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#F7F3F0] border border-[#EEE8E3] font-bold text-xs flex items-center justify-center gap-2 transition-colors text-[#242633] shadow-xs cursor-pointer"
          >
            <span>Record Treatment on #{selectedTokenId}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#686878]" />
          </button>
        </div>

        {/* Action 3: Micro-spectroscopy & Reflectography */}
        <div className="p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-2.5 rounded-2xl bg-[#D0BCE1]/40 text-[#5e4479] w-fit">
              <Microscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#242633]">
                Multi-Spectral Reflectography
              </h3>
              <p className="text-xs text-[#686878]">
                Infrared & X-Ray Diagnostics
              </p>
            </div>
            <p className="text-xs text-[#686878] leading-relaxed">
              Attach high-resolution infrared reflectography scans and pigment strata analysis reports directly to the token timeline.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleAction("Infrared Spectral Reflectography")}
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#F7F3F0] border border-[#EEE8E3] font-bold text-xs flex items-center justify-center gap-2 transition-colors text-[#242633] shadow-xs cursor-pointer"
          >
            <span>Attach Spectral Scan on #{selectedTokenId}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#686878]" />
          </button>
        </div>
      </div>

      {/* Lab Restoration History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#242633] flex items-center gap-2">
            <Hammer className="w-4 h-4 text-[#49C98A]" />
            <span>Masterpieces Under Laboratory Care ({restoredArtworks.length})</span>
          </h3>
          {onOpenPortfolio && (
            <button
              type="button"
              onClick={onOpenPortfolio}
              className="text-xs font-bold text-[#F07BAF] hover:text-[#242633] transition-colors cursor-pointer"
            >
              Browse All Artworks →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restoredArtworks.map((a) => (
            <div
              key={a.tokenId}
              onClick={() => setSelectedTokenId(a.tokenId)}
              className={`cursor-pointer rounded-3xl transition-all ${
                selectedTokenId === a.tokenId ? "ring-2 ring-[#49C98A] scale-[1.01]" : ""
              }`}
            >
              <ArtworkCard tokenId={a.tokenId} onSelect={onOpenTimeline} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
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

export function RestorerDashboardView() {
  const [selectedTokenId, setSelectedTokenId] = useState<number>(0);

  // Artworks with conservation or restoration history
  const restoredArtworks = MOCK_ARTWORKS.filter((a) =>
    ["Salvator Mundi", "The Starry Night", "The Thinker (Le Penseur)", "Girl with a Pearl Earring"].includes(a.title)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Role Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-tr from-emerald-500/10 via-brand-500/5 to-transparent space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Hammer className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Scientific Diagnostics Console
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Forensic Conservation & Restoration Lab
              </h2>
            </div>
          </div>

          <Link
            href="/verify"
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <FileSearch className="w-4 h-4" />
            <span>Launch Forensic SHA-256 Verifier</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          As a certified Master Conservator and Art Restorer, you are empowered to perform forensic integrity checks prior to treatment, issue scientific condition reports, and anchor chemical restoration logs permanently onto the blockchain.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Conserved Masterpieces</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">{restoredArtworks.length} Pieces</span>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Condition Reports Issued</span>
            <span className="text-lg font-bold text-emerald-500">14 Verified</span>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Forensic Integrity Rate</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">100% Unaltered</span>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Signing Authority</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">RESTORER_ROLE</span>
          </div>
        </div>
      </div>

      {/* Conservator Action Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Action 1: Pre-Restoration Forensic Check */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 w-fit">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Pre-Treatment Forensic Check
            </h3>
            <p className="text-xs text-slate-500">
              Zero-Trust Authenticity Audit
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Verify the physical artwork against the immutable genesis SHA-256 seal before admitting into the conservation cleanroom.
          </p>
          <Link
            href="/verify"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors text-slate-900 dark:text-white"
          >
            <span>Open Forensic Verifier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Action 2: Condition & Treatment Log */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Log Restoration Treatment
            </h3>
            <p className="text-xs text-slate-500">
              Varnish, Relining & Pigments
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Record chemical treatments, aged varnish removal, structural consolidation, and non-destructive surface cleaning on-chain.
          </p>
          <Link
            href={`/artwork/${selectedTokenId}`}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors text-slate-900 dark:text-white"
          >
            <span>Record Treatment on #{selectedTokenId}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Action 3: Micro-spectroscopy & Reflectography */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 w-fit">
            <Microscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Multi-Spectral Reflectography
            </h3>
            <p className="text-xs text-slate-500">
              Infrared & X-Ray Diagnostics
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Attach high-resolution infrared reflectography scans and pigment strata analysis reports directly to the token timeline.
          </p>
          <Link
            href={`/artwork/${selectedTokenId}`}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors text-slate-900 dark:text-white"
          >
            <span>Attach Spectral Scan to #{selectedTokenId}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Lab Restoration History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Hammer className="w-4 h-4 text-emerald-400" />
            <span>Masterpieces Under Laboratory Care ({restoredArtworks.length})</span>
          </h3>
          <Link
            href="/explore"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Browse All Artworks →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restoredArtworks.map((a) => (
            <div
              key={a.tokenId}
              onClick={() => setSelectedTokenId(a.tokenId)}
              className={`cursor-pointer rounded-2xl transition-all ${
                selectedTokenId === a.tokenId ? "ring-2 ring-emerald-500 scale-[1.01]" : ""
              }`}
            >
              <ArtworkCard tokenId={a.tokenId} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

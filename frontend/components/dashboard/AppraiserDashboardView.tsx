"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BadgeDollarSign,
  ShieldCheck,
  FileSearch,
  BadgeCheck,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Coins,
} from "lucide-react";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";
import { MOCK_ARTWORKS } from "@/lib/mockArtworks";

export function AppraiserDashboardView() {
  const [selectedTokenId, setSelectedTokenId] = useState<number>(0);

  // Artworks certified or appraised by Sotheby's Heritage
  const appraisedArtworks = MOCK_ARTWORKS.filter((a) =>
    ["Salvator Mundi", "The Starry Night", "Composition with Red, Blue and Yellow", "Water Lilies (Nymphéas)"].includes(a.title)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Role Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-yellow-500/20 bg-gradient-to-tr from-yellow-500/10 via-brand-500/5 to-transparent space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold">
              <BadgeDollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 block">
                Valuation Authority Console
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Appraisal & Authenticity Certification
              </h2>
            </div>
          </div>

          <Link
            href={`/artwork/${selectedTokenId}`}
            className="px-5 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-yellow-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Award className="w-4 h-4" />
            <span>Certify Valuation on Token #{selectedTokenId}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          As an accredited Fine Art Appraiser and Authenticity Authority, you possess exclusive signing permissions to issue certified market valuations, grade physical condition, and anchor independent insurance underwriting ratings to the blockchain.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Certified Portfolio</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">$580,000,000+ USD</span>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Appraisals Issued</span>
            <span className="text-lg font-bold text-yellow-400">18 Certificates</span>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Discrepancy Catch Rate</span>
            <span className="text-lg font-bold text-emerald-500">100% Precise</span>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Signing Authority</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">APPRAISER_ROLE</span>
          </div>
        </div>
      </div>

      {/* Appraiser Action Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Action 1: Official Valuation Attestation */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400 w-fit">
            <BadgeDollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Official Valuation Certificate
            </h3>
            <p className="text-xs text-slate-500">
              USD Market Attestation
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Record certified market valuations based on recent auction sales, artist historical index, and physical condition.
          </p>
          <Link
            href={`/artwork/${selectedTokenId}`}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors text-slate-900 dark:text-white"
          >
            <span>Record Valuation on #{selectedTokenId}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Action 2: Authenticity Forensic Inspection */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 w-fit">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Authenticity Audit Verifier
            </h3>
            <p className="text-xs text-slate-500">
              Pre-Auction Forensics
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Run zero-trust cryptographic verification between auction catalog photographs and on-chain SHA-256 genesis hashes.
          </p>
          <Link
            href="/verify"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors text-slate-900 dark:text-white"
          >
            <span>Open Forensic Verifier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Action 3: Insurance Underwriting Rating */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Insurance Risk Certification
            </h3>
            <p className="text-xs text-slate-500">
              Institutional Underwriting
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Assign investment-grade rating (Grade A1 Museum Quality, Grade A Investment Grade) and issue coverage certificates.
          </p>
          <Link
            href={`/artwork/${selectedTokenId}`}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors text-slate-900 dark:text-white"
          >
            <span>Log Rating on #{selectedTokenId}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Appraised Works Portfolio */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-yellow-400" />
            <span>Artworks in Valuation Portfolio ({appraisedArtworks.length})</span>
          </h3>
          <Link
            href="/explore"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Explore Master Registry →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {appraisedArtworks.map((a) => (
            <div
              key={a.tokenId}
              onClick={() => setSelectedTokenId(a.tokenId)}
              className={`cursor-pointer rounded-2xl transition-all ${
                selectedTokenId === a.tokenId ? "ring-2 ring-yellow-500 scale-[1.01]" : ""
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

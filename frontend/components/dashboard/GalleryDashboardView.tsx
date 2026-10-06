"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Landmark,
  ArrowRightLeft,
  Calendar,
  Box,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  MapPin,
  Clock,
} from "lucide-react";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";
import { MOCK_ARTWORKS } from "@/lib/mockArtworks";

export function GalleryDashboardView() {
  const [selectedTokenId, setSelectedTokenId] = useState<number>(0);

  // Artworks currently held or managed by the Gallery
  const galleryArtworks = MOCK_ARTWORKS.filter((a) =>
    ["Salvator Mundi", "Girl with a Pearl Earring", "Water Lilies (Nymphéas)", "Impression, Sunrise"].includes(a.title)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Role Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-blue-500/20 bg-gradient-to-tr from-blue-500/10 via-brand-500/5 to-transparent space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                Cultural Institution Console
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Gallery Custody Management
              </h2>
            </div>
          </div>

          <Link
            href={`/artwork/${selectedTokenId}`}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Log Custody Action on Token #{selectedTokenId}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          As an accredited Fine Art Gallery, your cryptographic address possesses on-chain authorization to record legal acquisitions, secondary ownership transfers, international museum loans, and secure vault relocations.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Inventory Under Custody</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">{galleryArtworks.length} Masterpieces</span>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Exhibition Loans</span>
            <span className="text-lg font-bold text-blue-400">3 Institutional</span>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Vault Security</span>
            <span className="text-lg font-bold text-emerald-500">Freeport Tier 1</span>
          </div>
          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Signing Authority</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">GALLERY_ROLE</span>
          </div>
        </div>
      </div>

      {/* Gallery Action Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Action 1: Custody Transfer */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 w-fit">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Ownership & Custody Transfer
            </h3>
            <p className="text-xs text-slate-500">
              Acquisition & Secondary Market
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Record institutional acquisitions, private treaty sales, or consignment handovers with cryptographic proof of delivery.
          </p>
          <Link
            href={`/artwork/${selectedTokenId}`}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors text-slate-900 dark:text-white"
          >
            <span>Record Transfer on #{selectedTokenId}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Action 2: Museum Exhibition Loan */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Museum Exhibition Loan
            </h3>
            <p className="text-xs text-slate-500">
              Curatorial Display Tracking
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Record temporary museum display agreements, retrospective loans, and international cultural showcase venues.
          </p>
          <Link
            href={`/artwork/${selectedTokenId}`}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors text-slate-900 dark:text-white"
          >
            <span>Log Museum Loan on #{selectedTokenId}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Action 3: Vault Relocation */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Vault & Storage Relocation
            </h3>
            <p className="text-xs text-slate-500">
              Physical Location Timestamp
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Record movement between climate-controlled vaults, Freeport facilities, and private collector storage chambers.
          </p>
          <Link
            href={`/artwork/${selectedTokenId}`}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors text-slate-900 dark:text-white"
          >
            <span>Log Vault Storage on #{selectedTokenId}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Gallery Inventory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-4 h-4 text-blue-400" />
            <span>Artworks Under Gallery Custody ({galleryArtworks.length})</span>
          </h3>
          <Link
            href="/explore"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            View Full Registry →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryArtworks.map((a) => (
            <div
              key={a.tokenId}
              onClick={() => setSelectedTokenId(a.tokenId)}
              className={`cursor-pointer rounded-2xl transition-all ${
                selectedTokenId === a.tokenId ? "ring-2 ring-blue-500 scale-[1.01]" : ""
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

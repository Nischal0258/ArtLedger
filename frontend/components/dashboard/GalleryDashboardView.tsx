"use client";

import React, { useState } from "react";
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
  Sparkles,
} from "lucide-react";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";
import { MOCK_ARTWORKS } from "@/lib/mockArtworks";
import { toast } from "sonner";

interface GalleryDashboardViewProps {
  onOpenTimeline?: (tokenId: number) => void;
  onOpenPortfolio?: () => void;
  onLogCustodyAction?: (tokenId: number, actionType: string) => void;
}

export function GalleryDashboardView({
  onOpenTimeline,
  onOpenPortfolio,
  onLogCustodyAction,
}: GalleryDashboardViewProps) {
  const [selectedTokenId, setSelectedTokenId] = useState<number>(0);

  // Artworks currently held or managed by the Gallery
  const galleryArtworks = MOCK_ARTWORKS.filter((a) =>
    [
      "Salvator Mundi",
      "Girl with a Pearl Earring",
      "Water Lilies (Nymphéas)",
      "Impression, Sunrise",
      "The Birth of Venus",
    ].includes(a.title)
  );

  const handleAction = (actionType: string) => {
    if (onLogCustodyAction) {
      onLogCustodyAction(selectedTokenId, actionType);
    } else {
      toast.success(
        `Custody action "${actionType}" recorded on-chain for Token #${selectedTokenId}!`
      );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Role Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#DBBA95]/20 text-[#855e30] flex items-center justify-center font-bold">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#855e30] block">
                Cultural Institution Console
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#242633]">
                Gallery Custody Management
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onOpenTimeline) {
                onOpenTimeline(selectedTokenId);
              } else {
                handleAction("Custody Inspection");
              }
            }}
            className="px-5 py-3 rounded-2xl brand-gradient text-[#242633] font-extrabold text-xs sm:text-sm shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)] flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4 text-[#242633]" />
            <span>Inspect Provenance on Token #{selectedTokenId}</span>
            <ArrowRight className="w-4 h-4 text-[#242633]" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#686878] max-w-3xl leading-relaxed">
          As an accredited Fine Art Gallery, your cryptographic address possesses on-chain authorization to record legal acquisitions, secondary ownership transfers, international museum loans, and secure vault relocations.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] text-[#686878] uppercase font-bold block">Inventory Under Custody</span>
            <span className="text-lg font-bold text-[#242633]">{galleryArtworks.length} Masterpieces</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] text-[#686878] uppercase font-bold block">Active Exhibition Loans</span>
            <span className="text-lg font-bold text-[#F07BAF]">4 Institutional</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] text-[#686878] uppercase font-bold block">Vault Security</span>
            <span className="text-lg font-bold text-[#1a7e4e]">Freeport Tier 1</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] text-[#686878] uppercase font-bold block">Signing Authority</span>
            <span className="text-lg font-bold text-[#242633]">GALLERY_ROLE</span>
          </div>
        </div>
      </div>

      {/* Gallery Action Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Action 1: Custody Transfer */}
        <div className="p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-2.5 rounded-2xl bg-[#DBBA95]/20 text-[#855e30] w-fit">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#242633]">
                Ownership & Custody Transfer
              </h3>
              <p className="text-xs text-[#686878]">
                Acquisition & Secondary Market
              </p>
            </div>
            <p className="text-xs text-[#686878] leading-relaxed">
              Record institutional acquisitions, private treaty sales, or consignment handovers with cryptographic proof of delivery.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleAction("Custody Transfer")}
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#F7F3F0] border border-[#EEE8E3] font-bold text-xs flex items-center justify-center gap-2 transition-colors text-[#242633] shadow-xs cursor-pointer"
          >
            <span>Record Transfer on #{selectedTokenId}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#686878]" />
          </button>
        </div>

        {/* Action 2: Museum Exhibition Loan */}
        <div className="p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-2.5 rounded-2xl bg-[#49C98A]/15 text-[#1a7e4e] w-fit">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#242633]">
                Museum Exhibition Loan
              </h3>
              <p className="text-xs text-[#686878]">
                Curatorial Display Tracking
              </p>
            </div>
            <p className="text-xs text-[#686878] leading-relaxed">
              Record temporary museum display agreements, retrospective loans, and international cultural showcase venues.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleAction("Museum Exhibition Loan")}
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#F7F3F0] border border-[#EEE8E3] font-bold text-xs flex items-center justify-center gap-2 transition-colors text-[#242633] shadow-xs cursor-pointer"
          >
            <span>Log Museum Loan on #{selectedTokenId}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#686878]" />
          </button>
        </div>

        {/* Action 3: Vault Relocation */}
        <div className="p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-2.5 rounded-2xl bg-[#F5A623]/15 text-[#a86500] w-fit">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#242633]">
                Vault & Storage Relocation
              </h3>
              <p className="text-xs text-[#686878]">
                Physical Location Timestamp
              </p>
            </div>
            <p className="text-xs text-[#686878] leading-relaxed">
              Record movement between climate-controlled vaults, Freeport facilities, and private collector storage chambers.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleAction("Vault Relocation")}
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#F7F3F0] border border-[#EEE8E3] font-bold text-xs flex items-center justify-center gap-2 transition-colors text-[#242633] shadow-xs cursor-pointer"
          >
            <span>Log Vault Storage on #{selectedTokenId}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#686878]" />
          </button>
        </div>
      </div>

      {/* Gallery Inventory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#242633] flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#DBBA95]" />
            <span>Artworks Under Gallery Custody ({galleryArtworks.length})</span>
          </h3>
          {onOpenPortfolio && (
            <button
              type="button"
              onClick={onOpenPortfolio}
              className="text-xs font-bold text-[#F07BAF] hover:text-[#242633] transition-colors cursor-pointer"
            >
              View Full Registry →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryArtworks.map((a) => (
            <div
              key={a.tokenId}
              onClick={() => setSelectedTokenId(a.tokenId)}
              className={`cursor-pointer rounded-3xl transition-all ${
                selectedTokenId === a.tokenId ? "ring-2 ring-[#F07BAF] scale-[1.01]" : ""
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

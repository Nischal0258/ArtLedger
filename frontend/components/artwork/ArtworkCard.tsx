"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Layers, ShieldCheck, ArrowRight } from "lucide-react";
import { resolveIPFSUrl } from "@/lib/formatters";
import { useArtwork } from "@/hooks/useArtwork";
import { useProvenance } from "@/hooks/useProvenance";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { MOCK_ARTWORKS } from "@/lib/mockArtworks";

interface ArtworkCardProps {
  tokenId: number | bigint;
  onSelect?: (tokenId: number) => void;
}

export function ArtworkCard({ tokenId, onSelect }: ArtworkCardProps) {
  const { artwork, isLoading: isArtworkLoading } = useArtwork(tokenId);
  const { count: eventCount } = useProvenance(tokenId);

  if (isArtworkLoading || !artwork) {
    return <CardSkeleton />;
  }

  const mockArtwork = MOCK_ARTWORKS.find((m) => m.tokenId === Number(tokenId));
  const imageUrl = mockArtwork?.imageUrl || resolveIPFSUrl(artwork.ipfsCID);

  return (
    <div className="group rounded-3xl border border-[#EEE8E3] glass-panel overflow-hidden flex flex-col justify-between transition-all hover:shadow-md hover:border-[#FABED7]/80">
      {/* Museum Framed Artwork Image Display */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-[#F7F3F0] via-white to-[#F7F3F0] flex items-center justify-center p-3">
        <img
          src={imageUrl}
          alt={artwork.title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#242633] text-[10px] font-mono font-bold tracking-wider border border-[#EEE8E3] shadow-xs">
          #{tokenId.toString()}
        </div>
        <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#49C98A] text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          <span>Verified</span>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-[#242633] group-hover:text-[#F07BAF] transition-colors line-clamp-1">
            {artwork.title}
          </h3>
          <p className="text-xs text-[#686878] line-clamp-1">
            By <span className="font-semibold text-[#434553]">{artwork.artistName}</span>
          </p>
        </div>

        {/* Specs Badges */}
        <div className="flex items-center gap-3 text-xs text-[#686878] pt-2 border-t border-[#EEE8E3]">
          <div className="flex items-center gap-1 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-[#DBBA95]" />
            <span>{artwork.year}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] truncate max-w-[120px]">
            <Layers className="w-3.5 h-3.5 text-[#DBBA95] shrink-0" />
            <span className="truncate">{artwork.medium}</span>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-1 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#49C98A]/10 border border-[#49C98A]/30 text-[#1a7e4e] font-bold text-[11px]">
            <ShieldCheck className="w-3 h-3" />
            <span>{eventCount} {eventCount === 1 ? "Event" : "Events"}</span>
          </span>

          {onSelect ? (
            <button
              type="button"
              onClick={() => onSelect(Number(tokenId))}
              className="inline-flex items-center gap-1 font-bold text-[#F07BAF] hover:text-[#242633] transition-colors cursor-pointer"
            >
              <span>Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href={`/artwork/${tokenId.toString()}`}
              className="inline-flex items-center gap-1 font-bold text-[#F07BAF] hover:text-[#242633] transition-colors"
            >
              <span>Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { Calendar, Layers, ShieldCheck, ArrowRight } from "lucide-react";
import { resolveIPFSUrl } from "@/lib/formatters";
import { useArtwork } from "@/hooks/useArtwork";
import { useProvenance } from "@/hooks/useProvenance";
import { CardSkeleton } from "@/components/ui/Skeleton";

interface ArtworkCardProps {
  tokenId: number | bigint;
}

export function ArtworkCard({ tokenId }: ArtworkCardProps) {
  const { artwork, isLoading: isArtworkLoading } = useArtwork(tokenId);
  const { count: eventCount } = useProvenance(tokenId);

  if (isArtworkLoading || !artwork) {
    return <CardSkeleton />;
  }

  const imageUrl = resolveIPFSUrl(artwork.ipfsCID);

  return (
    <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-lg hover:border-brand-500/50">
      {/* Image Banner */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img
          src={imageUrl}
          alt={artwork.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold tracking-wider">
          #{tokenId.toString()}
        </div>
      </div>

      {/* Details Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
            {artwork.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-1">
            By <span className="font-medium text-slate-700 dark:text-slate-300">{artwork.artistName}</span>
          </p>
        </div>

        {/* Specs Badges */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-brand-500" />
            <span>{artwork.year}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] truncate max-w-[120px]">
            <Layers className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            <span className="truncate">{artwork.medium}</span>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-1 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold text-[11px]">
            <ShieldCheck className="w-3 h-3" />
            <span>{eventCount} {eventCount === 1 ? "Event" : "Events"}</span>
          </span>

          <Link
            href={`/artwork/${tokenId.toString()}`}
            className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
          >
            <span>Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

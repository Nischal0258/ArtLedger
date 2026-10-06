"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  Calendar,
  Layers,
  Fingerprint,
  ExternalLink,
  History,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { useArtwork } from "@/hooks/useArtwork";
import { useProvenance } from "@/hooks/useProvenance";
import { resolveIPFSUrl, truncateHash, formatFullDate } from "@/lib/formatters";
import { TimelineEvent } from "@/components/provenance/TimelineEvent";
import { RoleActionPanel } from "@/components/provenance/RoleActionPanel";
import { QRCodeCard } from "@/components/provenance/QRCodeCard";
import { TimelineSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { AddressPill } from "@/components/ui/AddressPill";
import { CopyButton } from "@/components/ui/CopyButton";

export default function ArtworkDetailPage() {
  const params = useParams();
  const tokenId = params?.id as string;

  const { artwork, isLoading: isArtLoading, refetch: refetchArtwork } = useArtwork(tokenId);
  const { events, isLoading: isEventsLoading, refetch: refetchEvents } = useProvenance(tokenId);

  const handleRefresh = () => {
    refetchArtwork();
    refetchEvents();
  };

  if (isArtLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <TimelineSkeleton />
      </div>
    );
  }

  if (!artwork || !artwork.title) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          title="Artwork Not Found"
          description={`No registered provenance record exists for Token ID #${tokenId} on the ArtLedger contract.`}
          actionHref="/explore"
          actionLabel="Explore All Artworks"
        />
      </div>
    );
  }

  const imageUrl = resolveIPFSUrl(artwork.ipfsCID);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Gallery</span>
        </Link>
      </div>

      {/* Artwork Header & Metadata Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Preview */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-md">
            <img
              src={imageUrl}
              alt={artwork.title}
              className="w-full aspect-square object-cover"
              onError={(e) => {
                // Fallback image if IPFS gateway is slow
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80";
              }}
            />
          </div>
        </div>

        {/* Right Column: Key Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20 text-xs font-bold font-mono">
              <span>TOKEN #{tokenId}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {artwork.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
              By {artwork.artistName}
            </p>
          </div>

          {/* Metadata Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Year Completed</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-500" />
                {artwork.year}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Medium</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-500" />
                {artwork.medium}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 block mb-0.5 font-medium">Original Artist</span>
              <AddressPill address={artwork.mintedBy} chars={4} />
            </div>
          </div>

          {/* Cryptographic SHA-256 Fingerprint */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Fingerprint className="w-4 h-4 text-emerald-500" />
                <span>Cryptographic SHA-256 Digest</span>
              </span>
              <CopyButton textToCopy={artwork.imageHash} label="Copy Hash" />
            </div>
            <div className="font-mono text-xs text-slate-600 dark:text-slate-400 break-all select-all p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60">
              {artwork.imageHash}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <Link
              href={`/verify?id=${tokenId}`}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors shadow-md shadow-brand-500/20 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Physical Copy</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Split: Provenance Timeline vs Curator Action & QR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-slate-200 dark:border-slate-800">
        {/* Left Column: Chronological Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-brand-500" />
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Immutable Provenance History
              </h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {events.length} {events.length === 1 ? "Event" : "Events"} Recorded
            </span>
          </div>

          {isEventsLoading ? (
            <TimelineSkeleton />
          ) : events.length === 0 ? (
            <EmptyState
              title="No Events Recorded"
              description="No provenance events exist yet for this artwork."
            />
          ) : (
            <div className="pt-4">
              {events.map((evt, idx) => (
                <TimelineEvent
                  key={idx}
                  event={evt}
                  isFirst={idx === 0}
                  isLast={idx === events.length - 1}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Curator Action Panel & QR Card */}
        <div className="lg:col-span-5 space-y-6">
          <RoleActionPanel tokenId={tokenId} onEventLogged={handleRefresh} />
          <QRCodeCard tokenId={tokenId} artworkTitle={artwork.title} />
        </div>
      </div>
    </div>
  );
}

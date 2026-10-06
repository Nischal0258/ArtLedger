"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useReadContract } from "wagmi";
import {
  Compass,
  Search,
  Filter,
  Sparkles,
  SlidersHorizontal,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "@/lib/contract";
import { MOCK_ARTWORKS } from "@/lib/mockArtworks";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedium, setSelectedMedium] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Read total registered artworks on-chain
  const { data: totalSupplyData, isLoading } = useReadContract({
    address: ARTLEDGER_ADDRESS,
    abi: ARTLEDGER_ABI,
    functionName: "totalSupply",
  });

  const totalSupply = totalSupplyData !== undefined ? Number(totalSupplyData) : 0;

  // Combine on-chain tokens with registered museum mock artworks
  const displayedTokenIds = useMemo(() => {
    const idSet = new Set<number>();
    // Add all on-chain IDs
    for (let i = 0; i < totalSupply; i++) {
      idSet.add(i);
    }
    // Add all mock artworks
    MOCK_ARTWORKS.forEach((m) => {
      idSet.add(m.tokenId);
    });

    let list = Array.from(idSet);

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((id) => {
        const mock = MOCK_ARTWORKS.find((m) => m.tokenId === id);
        if (!mock) return id.toString().includes(q);
        return (
          mock.title.toLowerCase().includes(q) ||
          mock.artistName.toLowerCase().includes(q) ||
          mock.medium.toLowerCase().includes(q) ||
          mock.year.toString().includes(q) ||
          id.toString() === q
        );
      });
    }

    // Filter by medium
    if (selectedMedium !== "All") {
      list = list.filter((id) => {
        const mock = MOCK_ARTWORKS.find((m) => m.tokenId === id);
        return mock ? mock.medium === selectedMedium : true;
      });
    }

    // Sort order
    return sortOrder === "newest" ? list.reverse() : list;
  }, [totalSupply, searchQuery, selectedMedium, sortOrder]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Public Ledger Explorer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Explore Registered Artworks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Browse the permanent registry of fine art tokens, inspect cryptographic SHA-256 fingerprints, and examine verified multi-curator provenance timelines.
          </p>
        </div>

        <Link
          href="/mint"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-500/20 transition-all hover:shadow-lg hover:shadow-brand-500/30"
        >
          <Plus className="w-4 h-4" />
          <span>Register Artwork</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by title, artist, or Token #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Medium and Sort Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Medium Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedMedium}
              onChange={(e) => setSelectedMedium(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="All">All Mediums</option>
              <option value="Oil on Canvas">Oil on Canvas</option>
              <option value="Oil on Walnut Panel">Oil on Walnut Panel</option>
              <option value="Oil and Gold Leaf on Canvas">Oil & Gold Leaf</option>
              <option value="Bronze Sculpture">Bronze Sculpture</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-1.5 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {displayedTokenIds.length === 0 ? (
        <div className="py-16">
          <EmptyState
            title="No Matching Masterpieces"
            description="No registered artworks matched your search filters. Try adjusting your query or clear filters to view the permanent collection."
            actionHref="/explore"
            actionLabel="Reset Search Filters"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedTokenIds.map((id) => (
            <ArtworkCard key={id} tokenId={id} />
          ))}
        </div>
      )}
    </div>
  );
}

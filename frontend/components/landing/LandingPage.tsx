"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Layers,
  FileSearch,
  Compass,
  CheckCircle2,
  Lock,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MOCK_ARTWORKS } from "@/lib/mockArtworks";

export function LandingPage() {
  const { openAuthModal } = useAuth();

  // Featured masterpieces for preview
  const featured = MOCK_ARTWORKS.slice(0, 4);

  return (
    <div className="flex-1 flex flex-col bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Decorative subtle background aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-50/80 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Next-Gen Fine Art Provenance Protocol</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight mb-6 text-slate-900">
          Immutable On-Chain History for the World&apos;s Finest Art
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Combat art forgery with cryptographic SHA-256 image verification, decentralized Ethereum tokens, and tamper-proof custodial provenance records.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <button
            onClick={() => openAuthModal()}
            type="button"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 group hover:scale-[1.02]"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <Link
            href="/explore"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-sm transition-colors flex items-center justify-center gap-2 text-slate-800 shadow-sm"
          >
            <Compass className="w-4 h-4 text-slate-500" />
            <span>Explore Gallery</span>
          </Link>
        </div>

        {/* Protocol Trust Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border border-slate-200 rounded-2xl p-6 bg-slate-50/70 shadow-sm">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">100%</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">On-Chain Provenance</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">SHA-256</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Cryptographic Fingerprint</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">Zero-Trust</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Verification Engine</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">Instant</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Forgery Detection</div>
          </div>
        </div>
      </section>

      {/* Value Pillars Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
            Why Decentralized Art Provenance?
          </h2>
          <p className="text-sm text-slate-600">
            A three-tier cryptographic security architecture ensuring physical masterpieces cannot be forged or duplicated.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Cryptographic Binding</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every high-resolution image is hashed client-side before registration. The unique SHA-256 fingerprint is permanently sealed on Ethereum.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Historical Timeline</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every ownership transfer, museum exhibition loan, chemical restoration, and appraisal is appended to an immutable chronological log.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Zero-Trust Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authenticate physical pieces by cross-referencing artwork files against on-chain records, detecting altered copies and forgeries instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Collection Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Verified Masterpieces</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Featured Gallery Registry
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Inspect verified on-chain tokens with cryptographic SHA-256 digests and complete historical records.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <span>Explore All 8 Masterpieces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((item) => (
            <div
              key={item.tokenId}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-indigo-700 shadow-sm border border-slate-200">
                  Token #{item.tokenId}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {item.artistName} ({item.year})
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.medium}
                  </span>
                  <Link
                    href={`/artwork/${item.tokenId}`}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                  >
                    <span>View Record</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl p-8 sm:p-12 border border-slate-200 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Ready to Protect Art Authenticity?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Connect your Web3 browser wallet or explore with our instant Demo Sandbox to register art, verify hashes, and inspect museum records.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => openAuthModal()}
              type="button"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <Link
              href="/explore"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-bold text-sm transition-colors flex items-center justify-center gap-2 text-slate-800"
            >
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

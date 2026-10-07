"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const { isAuthenticated, openAuthModal } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Featured masterpieces for preview
  const featured = MOCK_ARTWORKS.slice(0, 4);

  return (
    <div className="flex-1 flex flex-col bg-[#F7F3F0] text-[#242633]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Multi-layered radial gradients & decorative blur spheres */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-[#DBBA95]/35 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[350px] bg-[#F07BAF]/30 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-[#FABED7]/35 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-[#EEE8E3] text-[#242633] text-xs font-semibold mb-6 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#49C98A] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#49C98A]" />
          </span>
          <span>Next-Gen Fine Art Provenance Protocol</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight mb-6 text-[#242633]">
          Immutable On-Chain History for the{" "}
          <span className="brand-gradient-text">World&apos;s Finest Art</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#686878] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Combat art forgery with cryptographic SHA-256 image verification, decentralized Ethereum tokens, and tamper-proof custodial provenance records.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <button
            onClick={() => openAuthModal()}
            type="button"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl brand-gradient text-[#242633] font-bold text-sm shadow-[0_15px_35px_-15px_rgba(219,186,149,0.55)] transition-all flex items-center justify-center gap-2 group hover:scale-105 active:scale-95"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <Link
            href="/explore"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#EEE8E3] text-[#242633] hover:bg-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xs hover:scale-105"
          >
            <Compass className="w-4 h-4 text-[#686878]" />
            <span>Explore Gallery</span>
          </Link>
        </div>

        {/* Protocol Trust Metrics (glass-panel) */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 shadow-[0_15px_35px_-15px_rgba(219,186,149,0.25)]">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold brand-gradient-text">100%</div>
            <div className="text-xs text-[#686878] mt-1 uppercase tracking-wider font-semibold">On-Chain Provenance</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#242633]">SHA-256</div>
            <div className="text-xs text-[#686878] mt-1 uppercase tracking-wider font-semibold">Cryptographic Fingerprint</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#242633]">Zero-Trust</div>
            <div className="text-xs text-[#686878] mt-1 uppercase tracking-wider font-semibold">Verification Engine</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1a7e4e]">Instant</div>
            <div className="text-xs text-[#686878] mt-1 uppercase tracking-wider font-semibold">Forgery Detection</div>
          </div>
        </div>
      </section>

      {/* Value Pillars Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-[#EEE8E3]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#242633] mb-3">
            Why Decentralized Art Provenance?
          </h2>
          <p className="text-sm text-[#686878]">
            A three-tier cryptographic security architecture ensuring physical masterpieces cannot be forged or duplicated.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel rounded-3xl p-8 space-y-4 shadow-xs hover:shadow-sm transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#DBBA95]/30 text-[#855e30] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#242633]">Cryptographic Binding</h3>
            <p className="text-xs text-[#686878] leading-relaxed">
              Every high-resolution image is hashed client-side before registration. The unique SHA-256 fingerprint is permanently sealed on Ethereum.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-8 space-y-4 shadow-xs hover:shadow-sm transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FABED7]/40 text-[#F07BAF] flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#242633]">Historical Timeline</h3>
            <p className="text-xs text-[#686878] leading-relaxed">
              Every ownership transfer, museum exhibition loan, chemical restoration, and appraisal is appended to an immutable chronological log.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-8 space-y-4 shadow-xs hover:shadow-sm transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#49C98A]/25 text-[#1a7e4e] flex items-center justify-center font-bold">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#242633]">Zero-Trust Verification</h3>
            <p className="text-xs text-[#686878] leading-relaxed">
              Authenticate physical pieces by cross-referencing artwork files against on-chain records, detecting altered copies and forgeries instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Collection Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-[#EEE8E3]">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-[#EEE8E3] text-[#242633] text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5 text-[#F07BAF]" />
              <span>Verified Masterpieces</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#242633]">
              Featured Gallery Registry
            </h2>
            <p className="text-xs sm:text-sm text-[#686878] mt-1 max-w-xl">
              Inspect verified on-chain tokens with cryptographic SHA-256 digests and complete historical records.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#242633] hover:text-[#F07BAF] transition-colors"
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
              className="glass-panel rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="aspect-[4/3] bg-white/50 relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#242633] shadow-xs border border-[#EEE8E3]">
                  Token #{item.tokenId}
                </span>
                <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full font-medium border border-[#49C98A]/30 bg-white/95 text-[#1a7e4e] px-2 py-0.5 text-[10px] shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#49C98A]" />
                  Verified
                </span>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <h4 className="font-bold text-sm text-[#242633] truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#686878] font-medium">
                    {item.artistName} ({item.year})
                  </p>
                </div>
                <div className="pt-2 border-t border-[#EEE8E3] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#686878] font-medium truncate max-w-[120px]">
                    {item.medium}
                  </span>
                  <Link
                    href={`/artwork/${item.tokenId}`}
                    className="text-xs font-bold brand-gradient-text inline-flex items-center gap-1 hover:opacity-80"
                  >
                    <span>View Record</span>
                    <ArrowRight className="w-3 h-3 text-[#F07BAF]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#242633]">
              Ready to Protect Art Authenticity?
            </h3>
            <p className="text-sm text-[#686878] leading-relaxed font-normal">
              Connect your Web3 browser wallet or explore with our instant Demo Sandbox to register art, verify hashes, and inspect museum records.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => openAuthModal()}
              type="button"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl brand-gradient text-[#242633] font-bold text-sm shadow-[0_15px_35px_-15px_rgba(219,186,149,0.55)] transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#242633]" />
              <span>Sign In</span>
            </button>
            <Link
              href="/explore"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#EEE8E3] text-[#242633] hover:bg-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xs hover:scale-105"
            >
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Layers,
  FileSearch,
  Compass,
  CheckCircle2,
  Lock,
  LayoutDashboard,
  Shield,
  Palette,
} from "lucide-react";
import { useAuthModal } from "@/lib/providers";
import { useUserRole } from "@/hooks/useUserRole";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";

export default function HomePage() {
  const { isConnected } = useUserRole();
  const { openAuthModal } = useAuthModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Featured artworks for public showcase on landing page
  const featuredTokenIds = [0, 1, 2, 4];

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Provenance & Authenticity Protocol</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight mb-6 text-slate-900 dark:text-white">
          Immutable On-Chain History for the World&apos;s Finest Art
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Combat art forgery with cryptographic SHA-256 verification, ERC-721 ownership tokens, and role-gated provenance logs created exclusively by certified institutions.
        </p>

        {/* Dynamic Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          {mounted && isConnected ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-all shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Curator Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              type="button"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-all shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          <Link
            href="/explore"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 font-semibold transition-colors flex items-center justify-center gap-2 text-slate-800 dark:text-slate-200"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Public Ledger</span>
          </Link>
        </div>

        {/* Protocol Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm">
          <div>
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">100%</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">On-Chain Verifiable</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">SHA-256</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">Image Integrity</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">4 Roles</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">RBAC Security</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-500">Instant</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">Forgery Detection</div>
          </div>
        </div>
      </section>

      {/* Protocol Architecture Value Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
            Built for Institutional Trust & Provenance
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A three-tier cryptographic security model ensuring physical art cannot be forged, duplicated, or misattributed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Cryptographic Binding</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every artwork file is hashed client-side before upload. The resulting SHA-256 fingerprint is permanently sealed into the token contract.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Multi-Curator Timeline</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Approved Galleries, Restorers, and Appraisers append immutable events for every exhibition, conditioning treatment, or audit.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Zero-Trust Verification</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Authenticate physical pieces by cross-referencing high-resolution images against the on-chain registry, catching altered copies instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Masterpieces Gallery Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Permanent Collection Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Featured Registered Masterpieces
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Inspect verified on-chain tokens with cryptographic SHA-256 digests and multi-institutional provenance records.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
          >
            <span>Explore All Registered Artworks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTokenIds.map((id) => (
            <ArtworkCard key={id} tokenId={id} />
          ))}
        </div>
      </section>

      {/* Public Call-To-Action Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 bg-gradient-to-tr from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Decentralized Cultural Heritage</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Protect Fine Art Authenticity Forever
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Empower artists, accredited institutions, and collectors with tamper-proof provenance on the Ethereum network.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {mounted && isConnected ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 text-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                type="button"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get Started</span>
              </button>
            )}

            <Link
              href="/explore"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 font-semibold transition-colors flex items-center justify-center gap-2 text-sm text-slate-800 dark:text-slate-200"
            >
              <Compass className="w-4 h-4" />
              <span>View Gallery</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

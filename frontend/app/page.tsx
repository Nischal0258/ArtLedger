import React from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, ArrowRight, Layers, FileSearch, ShieldAlert } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Provenance & Authenticity Protocol</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight mb-6">
          Immutable On-Chain History for the World&apos;s Finest Art
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Combat art forgery with cryptographic SHA-256 verification, ERC-721 ownership tokens, and role-gated provenance logs created exclusively by certified institutions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <Link
            href="/mint"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-all shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2"
          >
            Register Artwork
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/explore"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 font-semibold transition-colors flex items-center justify-center gap-2"
          >
            Explore Gallery
          </Link>
        </div>

        {/* Live Metrics Grid */}
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

      {/* Value Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Cryptographic Binding</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every artwork file is hashed client-side before upload. The resulting SHA-256 fingerprint is permanently sealed into the token contract.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Multi-Curator Timeline</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Approved Galleries, Restorers, and Appraisers append immutable events for every exhibition, conditioning treatment, or audit.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Zero-Trust Verification</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Anyone can upload an artwork photo to cross-reference against the on-chain registry, catching altered copies or forged replicas instantly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

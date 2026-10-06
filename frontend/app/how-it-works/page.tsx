import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Palette,
  Landmark,
  Hammer,
  BadgeDollarSign,
  QrCode,
  Fingerprint,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      title: "Cryptographic Registration",
      icon: Palette,
      badge: "Artist Role",
      desc: "The primary artist mints an ERC-721 token on Ethereum. In the browser, a SHA-256 fingerprint of the high-resolution media file is generated and permanently embedded into the token contract alongside the IPFS CID.",
    },
    {
      step: "02",
      title: "Institutional Role Certification",
      icon: ShieldCheck,
      badge: "RBAC Access Control",
      desc: "Rather than allowing arbitrary accounts to edit history, ArtLedger employs institutional role segregation. Only approved Artists, Galleries, Restorers, and Certified Appraisers are authorized to log lifecycle events.",
    },
    {
      step: "03",
      title: "Immutable Lifecycle Logging",
      icon: Layers,
      badge: "Curator Network",
      desc: "Whenever an artwork is exhibited, loaned to a museum, cleaned in a conservation lab, or professionally appraised for insurance, the approved institution signs an authenticated on-chain event.",
    },
    {
      step: "04",
      title: "Physical-Digital Dual Binding",
      icon: QrCode,
      badge: "Zero-Trust Verification",
      desc: "Each artwork receives a cryptographic QR code label for mounting on its physical frame. Observers or collectors can scan the label or upload a photo to verify authenticity against the on-chain SHA-256 digest in seconds.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Protocol Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
          How ArtLedger Eliminates Art Forgery
        </h1>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          Combining ERC-721 ownership tokens, OpenZeppelin AccessControl, client-side SHA-256 hashing, and decentralized IPFS pinning for verifiable provenance.
        </p>
      </div>

      {/* 4 Steps Visual Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-4 group hover:border-brand-500/50 transition-colors"
            >
              <div className="absolute top-6 right-6 font-mono font-black text-4xl text-slate-100 dark:text-slate-800 pointer-events-none group-hover:text-brand-500/10 transition-colors">
                {item.step}
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
                    {item.badge}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Authority Matrix */}
      <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-brand-500" />
          <span>Role Segregation & Permissions Matrix</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Role Authority</th>
                <th className="p-3">Eligible Entities</th>
                <th className="p-3">Authorized Actions</th>
                <th className="p-3">Security Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="p-3 font-bold text-purple-400">ARTIST_ROLE</td>
                <td className="p-3">Verified artists, studios</td>
                <td className="p-3">Mint new artwork, set SHA-256 fingerprint & metadata</td>
                <td className="p-3 font-semibold text-emerald-500">Genesis Minter</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-400">GALLERY_ROLE</td>
                <td className="p-3">Museums, galleries, auction houses</td>
                <td className="p-3">Log custody transfers, loans, exhibition displays</td>
                <td className="p-3 font-semibold text-blue-400">Curator</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-400">RESTORER_ROLE</td>
                <td className="p-3">Conservators, restoration labs</td>
                <td className="p-3">Record cleaning, stabilization, and damage repairs</td>
                <td className="p-3 font-semibold text-emerald-400">Preservation</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-amber-400">APPRAISER_ROLE</td>
                <td className="p-3">Certified evaluators, insurers</td>
                <td className="p-3">Log official market valuations & authenticity certificates</td>
                <td className="p-3 font-semibold text-amber-400">Audit Authority</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Call to Action */}
      <div className="p-10 rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-center space-y-5 shadow-2xl shadow-brand-500/25">
        <h2 className="text-2xl sm:text-3xl font-black">
          Ready to Test the Provenance Protocol?
        </h2>
        <p className="text-sm max-w-xl mx-auto opacity-90 leading-relaxed">
          Connect your wallet, register a masterpiece with cryptographic SHA-256 verification, and explore the public provenance timeline.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/mint"
            className="px-6 py-3 rounded-xl bg-white text-brand-600 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors shadow-lg"
          >
            Register Artwork
          </Link>
          <Link
            href="/explore"
            className="px-6 py-3 rounded-xl border border-white/40 text-white font-bold text-xs sm:text-sm hover:bg-white/10 transition-colors"
          >
            Explore Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}

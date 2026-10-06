import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink, Github, FileCode, CheckCircle2 } from "lucide-react";
import { ARTLEDGER_ADDRESS } from "@/lib/contract";
import { truncateAddress } from "@/lib/formatters";

export function Footer() {
  const explorerUrl = `https://sepolia.etherscan.io/address/${ARTLEDGER_ADDRESS}`;

  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 text-xs transition-colors py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200/60 dark:border-slate-800/60">
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>ArtLedger Provenance Protocol</span>
            </div>
            <p className="max-w-md text-xs leading-relaxed">
              Standardized cryptographic provenance and condition recording on Ethereum Sepolia.
            </p>
          </div>

          {/* Network & Contract Details */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-semibold text-[11px]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sepolia Testnet</span>
            </div>

            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px] transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-slate-400" />
              <span>Contract: {truncateAddress(ARTLEDGER_ADDRESS, 4)}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href="https://github.com/Nischal0258/ArtLedger.git"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Footer Navigation & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-6">
            <Link href="/explore" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Explore Gallery
            </Link>
            <Link href="/mint" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Register Artwork
            </Link>
            <Link href="/verify" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Verify Hash
            </Link>
            <Link href="/how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              How It Works
            </Link>
          </div>

          <div className="text-slate-400">
            © {new Date().getFullYear()} ArtLedger. Built for Web3 Authenticity & Provenance.
          </div>
        </div>
      </div>
    </footer>
  );
}

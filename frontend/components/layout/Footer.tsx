import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink, Github, FileCode } from "lucide-react";
import { ARTLEDGER_ADDRESS } from "@/lib/contract";
import { truncateAddress } from "@/lib/formatters";

export function Footer() {
  const explorerUrl = `https://sepolia.etherscan.io/address/${ARTLEDGER_ADDRESS}`;

  return (
    <footer className="w-full border-t border-[#EEE8E3] glass-panel-subtle text-[#686878] text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#EEE8E3]">
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5">
            <div className="flex items-center gap-2 text-[#242633] font-extrabold text-sm">
              <div className="w-5 h-5 rounded-lg brand-gradient text-[#242633] flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span>ArtLedger Provenance Protocol</span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-[#686878]">
              Standardized cryptographic provenance and condition recording on Ethereum Sepolia.
            </p>
          </div>

          {/* Network & Contract Details */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#49C98A]/10 border border-[#49C98A]/30 text-[#1a7e4e] font-bold text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#49C98A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#49C98A]"></span>
              </span>
              <span>Sepolia Testnet / Local Node</span>
            </div>

            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#EEE8E3] bg-white/80 hover:bg-white text-[#434553] font-mono text-[11px] transition-colors shadow-2xs"
            >
              <FileCode className="w-3.5 h-3.5 text-[#DBBA95]" />
              <span>Contract: {truncateAddress(ARTLEDGER_ADDRESS, 4)}</span>
              <ExternalLink className="w-3 h-3 text-[#686878]" />
            </a>

            <a
              href="https://github.com/Nischal0258/ArtLedger.git"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#EEE8E3] bg-white/80 hover:bg-white text-[#434553] text-[11px] transition-colors shadow-2xs font-semibold"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Footer Navigation & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex flex-wrap items-center gap-6 font-medium">
            <Link href="/explore" className="hover:text-[#242633] transition-colors">
              Explore Gallery
            </Link>
            <Link href="/how-it-works" className="hover:text-[#242633] transition-colors">
              How It Works
            </Link>
          </div>

          <div className="text-[#686878]">
            © {new Date().getFullYear()} ArtLedger. Built for Web3 Authenticity & Provenance.
          </div>
        </div>
      </div>
    </footer>
  );
}

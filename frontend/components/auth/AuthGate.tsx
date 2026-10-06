"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Lock, ShieldCheck, ArrowRight, Sparkles, Compass, Shield } from "lucide-react";

interface AuthGateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  requiredRole?: string;
}

export function AuthGate({
  children,
  title = "Curator Authentication Required",
  description = "This section is restricted to registered curators, artists, and institutional partners. Please connect your Web3 wallet to access your dashboard and tools.",
  requiredRole,
}: AuthGateProps) {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-medium">Verifying curator credentials...</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-8 sm:p-10 text-center space-y-6 animate-fade-in">
          {/* Glowing Lock Badge */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600/20 to-purple-600/20 border border-brand-500/30 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Restricted Curator Area</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              {description}
            </p>
          </div>

          {/* Web3 Connect Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  type="button"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Log In / Connect Wallet</span>
                </button>
              )}
            </ConnectButton.Custom>

            <Link
              href="/explore"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Gallery</span>
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-[11px] text-slate-400 font-medium">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50">
              Genesis Registration
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50">
              SHA-256 Forensics
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50">
              Certified Timeline
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

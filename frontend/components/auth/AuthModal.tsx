"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "sonner";
import {
  X,
  Sparkles,
  ShieldCheck,
  Wallet,
  ArrowRight,
  Palette,
  Landmark,
  Hammer,
  BadgeDollarSign,
  Shield,
  CheckCircle2,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // When connection succeeds while modal is open, congratulate and close
  useEffect(() => {
    if (isConnected && isOpen) {
      toast.success("Signed in successfully! Welcome to your Curator Dashboard.");
      onClose();
    }
  }, [isConnected, isOpen, onClose]);

  if (!isOpen) return null;

  const handleWalletConnect = () => {
    if (openConnectModal) {
      openConnectModal();
    } else {
      toast.error("Wallet connector initializing, please try again in a moment.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center shadow-md shadow-brand-500/25">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-none">
                ArtLedger
              </h3>
              <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold uppercase tracking-wider mt-1">
                Provenance Protocol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "login"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "signup"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Tab 1: Sign In Content */}
        {mode === "login" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Curator Sign In
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Connect your Web3 Ethereum wallet (MetaMask, Coinbase, Rainbow, or WalletConnect). Your cryptographic key acts as your secure, passwordless identity.
              </p>
            </div>

            <button
              onClick={handleWalletConnect}
              type="button"
              className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 group"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet to Sign In</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Zero-Trust Blockchain Security</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                No email or password needed. All actions on ArtLedger are authenticated and timestamped directly on the Ethereum Sepolia ledger.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Sign Up / Register Content */}
        {mode === "signup" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                New Curator Registration
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Get started in 3 simple steps to register physical artwork, verify media hashes, or log institutional provenance.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40">
                <span className="w-5 h-5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Connect Ethereum Wallet:
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Your unique cryptographic address will identify your curated tokens.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40">
                <span className="w-5 h-5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Access Curator Dashboard:
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Launch registration wizards, forensic verifiers, and portfolio management.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40">
                <span className="w-5 h-5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Obtain Institutional Roles:
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Request Artist, Gallery, Restorer, or Appraiser signing authorities.
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleWalletConnect}
              type="button"
              className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4" />
              <span>Connect Wallet to Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

        {/* Local Testnet Hint */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center">
          Supported: MetaMask, Coinbase, Rainbow, WalletConnect (Sepolia & Local Hardhat)
        </div>
      </div>
    </div>
  );
}

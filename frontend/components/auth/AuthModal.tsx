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
  ShieldAlert,
  ChevronDown,
  Layers,
  Zap,
} from "lucide-react";
import { useDemoWallet, DEMO_PERSONAS, DemoPersona } from "@/lib/demoWallet";

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
  const { isConnected: isRealConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const {
    isDemoMode,
    activePersona,
    connectDemoWallet,
    switchDemoPersona,
    disconnectDemoWallet,
  } = useDemoWallet();

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPersonaPicker, setShowPersonaPicker] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState("admin");

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // When connection succeeds while modal is open, congratulate and close
  useEffect(() => {
    if (isRealConnected && isOpen) {
      toast.success("Signed in successfully! Redirecting to Curator Dashboard...");
      onClose();
      window.location.href = "/dashboard";
    }
  }, [isRealConnected, isOpen, onClose]);

  if (!isOpen) return null;

  const handleWalletConnect = () => {
    if (openConnectModal) {
      openConnectModal();
    } else {
      toast.error("Wallet connector initializing, please try again in a moment.");
    }
  };

  const handleDemoSignIn = (personaId: string) => {
    connectDemoWallet(personaId);
    onClose();
    window.location.href = "/dashboard";
  };

  const selectedPersona =
    DEMO_PERSONAS.find((p) => p.id === selectedPersonaId) || DEMO_PERSONAS[0];

  const getPersonaIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldAlert":
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      case "Landmark":
        return <Landmark className="w-4 h-4 text-blue-500" />;
      case "Hammer":
        return <Hammer className="w-4 h-4 text-emerald-500" />;
      case "BadgeDollarSign":
        return <BadgeDollarSign className="w-4 h-4 text-yellow-500" />;
      case "Palette":
        return <Palette className="w-4 h-4 text-purple-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-brand-500" />;
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
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 animate-fade-in space-y-6 max-h-[92vh] overflow-y-auto">
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

        {/* ================= VIRTUAL DEMO WALLET (FEATURED) ================= */}
        <div className="rounded-2xl border-2 border-brand-500/30 bg-gradient-to-b from-brand-500/10 via-brand-500/5 to-transparent p-4 sm:p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎭</span>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Virtual Demo Wallet</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-semibold border border-emerald-500/20">
                    Recommended
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Instant sign in without MetaMask or browser extensions
                </p>
              </div>
            </div>
          </div>

          {/* Quick Persona Selector Dropdown / Grid */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
              Select Demo Curator Persona:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {DEMO_PERSONAS.map((persona) => {
                const isSelected = selectedPersonaId === persona.id;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => setSelectedPersonaId(persona.id)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-brand-500 bg-white dark:bg-slate-800 shadow-sm ring-1 ring-brand-500"
                        : "border-slate-200/80 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-850"
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                      {getPersonaIcon(persona.iconName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {persona.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {persona.roleName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {persona.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Connect Demo Wallet CTA */}
          <button
            onClick={() => handleDemoSignIn(selectedPersonaId)}
            type="button"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 group transition-all"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>
              {mode === "login" ? "Sign In as " : "Create Account as "}
              {selectedPersona.name} ({selectedPersona.roleName})
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Divider with 'OR' */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <span className="relative px-3 bg-white dark:bg-slate-900 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Or Real Web3 Wallet
          </span>
        </div>

        {/* Real Web3 Wallet Connect Option */}
        <div className="space-y-3">
          <button
            onClick={handleWalletConnect}
            type="button"
            className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <Wallet className="w-4 h-4 text-slate-500" />
            <span>Connect Web3 Wallet (MetaMask, Coinbase, Rainbow)</span>
          </button>

          <p className="text-[11px] text-center text-slate-400 leading-relaxed">
            {mode === "login"
              ? "Zero-trust blockchain authentication. Your cryptographic signature verifies your curator identity on Ethereum."
              : "Registering connects your Ethereum address as a verified provenance node on ArtLedger."}
          </p>
        </div>

        {/* Local Testnet Hint */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Local Hardhat Node Active (Chain ID 31337)</span>
        </div>
      </div>
    </div>
  );
}

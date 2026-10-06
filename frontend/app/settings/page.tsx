"use client";

import React from "react";
import { useAccount, useChainId } from "wagmi";
import {
  Settings,
  Sun,
  Moon,
  Network,
  FileCode,
  Trash2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/lib/providers";
import { ARTLEDGER_ADDRESS } from "@/lib/contract";
import { CopyButton } from "@/components/ui/CopyButton";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const handleClearCache = () => {
    localStorage.removeItem("artledger-theme");
    toast.success("Local preferences reset to defaults");
  };

  const explorerUrl = `https://sepolia.etherscan.io/address/${ARTLEDGER_ADDRESS}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/20 text-xs font-semibold mb-3">
          <Settings className="w-3.5 h-3.5" />
          <span>System Preferences</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          Settings & Diagnostics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure interface options and review connected network diagnostics.
        </p>
      </div>

      {/* Appearance Settings */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Appearance & Theme
        </h2>
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
              Color Palette Mode
            </span>
            <span className="text-xs text-slate-400">
              Current mode: <strong className="capitalize">{theme}</strong>
            </span>
          </div>

          <button
            onClick={toggleTheme}
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Switch to Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span>Switch to Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Network & Contract Diagnostics */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Network className="w-4 h-4 text-brand-500" />
          <span>Network & Contract Diagnostics</span>
        </h2>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span className="text-slate-500">Connected Chain ID</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {chainId ? `${chainId} (Sepolia)` : "11155111"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center text-slate-500">
              <span>Deployed ArtLedger Address</span>
              <CopyButton textToCopy={ARTLEDGER_ADDRESS} label="Copy Address" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-800 dark:text-slate-200 select-all truncate max-w-[280px] sm:max-w-none">
                {ARTLEDGER_ADDRESS}
              </span>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>Etherscan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Storage & Cache Management */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Client Storage & Cache
        </h2>
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
              Reset Local Preferences
            </span>
            <span className="text-xs text-slate-400">
              Clears saved theme and UI state stored in browser localStorage.
            </span>
          </div>

          <button
            onClick={handleClearCache}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
}

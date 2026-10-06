import React from "react";
import { ExternalLink } from "lucide-react";
import { truncateAddress } from "@/lib/formatters";
import { CopyButton } from "./CopyButton";

interface AddressPillProps {
  address?: string;
  ensName?: string;
  chars?: number;
  showCopy?: boolean;
  showExplorer?: boolean;
  className?: string;
}

export function AddressPill({
  address,
  ensName,
  chars = 4,
  showCopy = true,
  showExplorer = true,
  className = "",
}: AddressPillProps) {
  if (!address) return null;

  const display = ensName || truncateAddress(address, chars);
  const explorerUrl = `https://sepolia.etherscan.io/address/${address}`;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs font-mono text-slate-700 dark:text-slate-300 ${className}`}
    >
      <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
      <span className="font-medium select-all">{display}</span>

      {showCopy && <CopyButton textToCopy={address} iconOnly className="hover:bg-slate-200 dark:hover:bg-slate-800" />}

      {showExplorer && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-0.5 rounded"
          title="View on Sepolia Etherscan"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}

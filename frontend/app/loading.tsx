import React from "react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium animate-pulse">
        Fetching on-chain provenance records...
      </p>
    </div>
  );
}

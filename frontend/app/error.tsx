"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6 border border-rose-500/20">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight mb-2">
        Application Error Encountered
      </h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        An unexpected error occurred while communicating with the network or rendering this view.
      </p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors shadow-lg shadow-brand-500/20 flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Attempt Recovery
      </button>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { Compass, ShieldQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-6 border border-brand-500/20">
        <ShieldQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        404 — Artwork Not Found
      </h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        The cryptographic record or page you are searching for does not exist on this ledger or was entered incorrectly.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors shadow-lg shadow-brand-500/20"
        >
          Return Home
        </Link>
        <Link
          href="/explore"
          className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium transition-colors flex items-center gap-2"
        >
          <Compass className="w-4 h-4" />
          Explore Ledger
        </Link>
      </div>
    </div>
  );
}

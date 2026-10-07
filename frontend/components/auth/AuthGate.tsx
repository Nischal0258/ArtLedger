"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, ShieldCheck, ArrowRight, Sparkles, Compass, Shield, UserCheck, RefreshCw } from "lucide-react";
import { useAuthModal } from "@/lib/providers";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth, UserRole } from "@/context/AuthContext";

interface AuthGateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  requiredRole?: UserRole;
}

export function AuthGate({
  children,
  title = "Curator Authentication Required",
  description = "This section is restricted to registered curators, artists, and institutional partners. Please connect your Web3 wallet or Virtual Demo Wallet to access your dashboard and tools.",
  requiredRole,
}: AuthGateProps) {
  const { isConnected, isDefaultAdmin, isArtist, isGallery, isRestorer, isAppraiser, isDemoMode } = useUserRole();
  const { isAuthenticated, user, switchRole } = useAuth();
  const { openAuthModal } = useAuthModal();
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

  const effectiveConnected = isConnected || isAuthenticated;

  // 1. Not connected at all
  if (!effectiveConnected) {
    return (
      <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full rounded-3xl border border-slate-200 bg-white shadow-xl p-8 sm:p-10 text-center space-y-6 animate-fade-in">
          {/* Glowing Lock Badge */}
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Restricted Curator Area</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
              {description}
            </p>
          </div>

          {/* Web3 Connect & Demo Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal("login")}
              type="button"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Sign In</span>
            </button>

            <Link
              href="/explore"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Gallery</span>
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-2 text-[11px] text-slate-400 font-medium">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              Genesis Registration
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              SHA-256 Forensics
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              Certified Timeline
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Check role requirement if specified
  if (requiredRole) {
    const hasRole =
      isDefaultAdmin ||
      (requiredRole === "Artist" && isArtist) ||
      (requiredRole === "Gallery" && isGallery) ||
      (requiredRole === "Restorer" && isRestorer) ||
      (requiredRole === "Appraiser" && isAppraiser);

    if (!hasRole) {
      return (
        <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full rounded-3xl border border-amber-200 bg-amber-50/50 p-8 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                {requiredRole} Role Required
              </h3>
              <p className="text-xs text-slate-600">
                You are currently signed in as <strong>{user?.name}</strong> ({user?.role}). This feature requires {requiredRole} privileges.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => switchRole(requiredRole)}
                className="w-full px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Switch to {requiredRole} Role (1-Click)</span>
              </button>

              <Link
                href="/dashboard"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  ShieldCheck,
  Search,
  Moon,
  Sun,
  Menu,
  Sparkles,
  ChevronRight,
  Shield,
  LayoutDashboard,
} from "lucide-react";
import { useTheme, useAuthModal } from "@/lib/providers";
import { useUserRole } from "@/hooks/useUserRole";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { MobileDrawer } from "./MobileDrawer";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { openAuthModal } = useAuthModal();
  const { isConnected, roleHash, isDefaultAdmin } = useUserRole();
  const [searchTokenId, setSearchTokenId] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTokenId.trim()) {
      router.push(`/artwork/${searchTokenId.trim()}`);
      setSearchTokenId("");
    }
  };

  // Strictly separate public navigation from authenticated curator navigation
  const navLinks = isConnected
    ? [
        { href: "/explore", label: "Explore Gallery" },
        { href: "/dashboard", label: "Dashboard", isDashboard: true },
        { href: "/how-it-works", label: "How It Works" },
      ]
    : [
        { href: "/explore", label: "Explore Gallery" },
        { href: "/how-it-works", label: "How It Works" },
      ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                ArtLedger
              </span>
              <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 font-semibold tracking-wider uppercase mt-0.5">
                Provenance Protocol
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const isDashboard = item.isDashboard;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-bold"
                      : isDashboard
                      ? "text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {isDashboard && <LayoutDashboard className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Search & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Token ID jump */}
          <form onSubmit={handleSearch} className="hidden sm:flex relative items-center">
            <input
              type="text"
              placeholder="Jump to Token #..."
              value={searchTokenId}
              onChange={(e) => setSearchTokenId(e.target.value)}
              className="w-36 lg:w-44 pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          </form>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle color theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Custom Web3 Connect Button */}
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={() => openAuthModal("login")}
                          type="button"
                          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Sign In</span>
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          Wrong Network
                        </button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2">
                        {/* Direct Dashboard button */}
                        <Link
                          href="/dashboard"
                          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/20 text-xs font-semibold transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          <span>Dashboard</span>
                        </Link>

                        {/* Role Chip */}
                        <div className="hidden lg:block">
                          <RoleBadge roleHash={roleHash} />
                        </div>

                        {/* Account Pill */}
                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-mono font-medium transition-colors"
                        >
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{account.displayName}</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <MobileDrawer isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </header>
  );
}

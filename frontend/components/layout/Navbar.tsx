"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  Search,
  Menu,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MobileDrawer } from "./MobileDrawer";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  const [searchTokenId, setSearchTokenId] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTokenId.trim()) {
      router.push(`/artwork/${searchTokenId.trim()}`);
      setSearchTokenId("");
    }
  };

  const navLinks = [
    { href: "/explore", label: "Explore Gallery" },
    { href: "/how-it-works", label: "How It Works" },
  ];

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EEE8E3] bg-[#F7F3F0]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#DBBA95] via-[#FABED7] to-[#F07BAF] text-[#242633] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-[#242633]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-[#242633] leading-none">
                ArtLedger
              </span>
              <span className="text-[10px] font-bold text-[#F07BAF] tracking-wider uppercase mt-0.5">
                Provenance Protocol
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/50 border border-[#EEE8E3]">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? "nav-pill-active"
                      : "text-[#686878] hover:text-[#242633] hover:bg-white/60"
                  }`}
                >
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
              className="w-36 lg:w-44 pl-8 pr-3 py-1.5 text-xs rounded-full border border-[#EEE8E3] bg-white/60 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-[#F07BAF] text-[#242633] placeholder:text-[#686878]/60 font-medium"
            />
            <Search className="w-3.5 h-3.5 text-[#686878] absolute left-2.5 pointer-events-none" />
          </form>

          {/* Authentication & User Controls */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              {/* User Avatar Badge with Gradient Ring */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#EEE8E3] bg-white/70 backdrop-blur-md text-xs font-semibold text-[#242633] shadow-xs">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full p-[1.5px] bg-gradient-to-tr from-[#DBBA95] via-[#FABED7] to-[#F07BAF]">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-[10px] text-[#242633]">
                      {user.name.charAt(0)}
                    </div>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#49C98A] ring-1 ring-white" />
                </div>
                <span className="font-bold text-[#242633]">
                  {user.name.split(" ")[0]}
                </span>
                <span className="text-[#686878] font-mono text-[11px]">
                  ({truncateAddress(user.address)})
                </span>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={logout}
                type="button"
                className="p-2 rounded-2xl text-[#686878] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign out / disconnect"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              type="button"
              className="px-5 py-2 rounded-2xl brand-gradient text-[#242633] text-xs font-bold shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)] transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#242633]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2 rounded-2xl text-[#686878] hover:text-[#242633] hover:bg-white/60"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <MobileDrawer isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </header>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Compass,
  HelpCircle,
  LayoutDashboard,
  Sparkles,
  LogOut,
  Palette,
  FileSearch,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  if (!isOpen) return null;

  const navLinks = isAuthenticated
    ? [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/explore", label: "Explore Gallery", icon: Compass },
        { href: "/mint", label: "Register Artwork", icon: Palette },
        { href: "/verify", label: "Verify Authenticity", icon: FileSearch },
        { href: "/how-it-works", label: "How It Works", icon: HelpCircle },
      ]
    : [
        { href: "/explore", label: "Explore Gallery", icon: Compass },
        { href: "/how-it-works", label: "How It Works", icon: HelpCircle },
      ];

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative ml-auto w-4/5 max-w-sm h-full bg-white border-l border-slate-200 p-6 flex flex-col justify-between shadow-2xl animate-fade-in overflow-y-auto text-slate-900">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="font-extrabold text-base text-slate-900">
              ArtLedger Navigation
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Account Info if Authenticated */}
          {isAuthenticated && user && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Connected Account
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="font-bold text-sm text-slate-900 truncate">
                {user.name}
              </div>
              <div className="text-xs text-slate-500 truncate font-medium">
                {user.email}
              </div>
              <div className="text-[11px] font-mono text-indigo-600 font-semibold truncate pt-1">
                {truncateAddress(user.address)} • {user.balance || "2.45 ETH"}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out / Disconnect</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                openAuthModal();
              }}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

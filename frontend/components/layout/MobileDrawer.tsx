"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

  const navLinks = [
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#242633]/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative ml-auto w-4/5 max-w-sm h-full glass-modal border-l border-white/80 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto text-[#242633]"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EEE8E3]">
            <span className="font-extrabold text-base text-[#242633]">
              ArtLedger Navigation
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#686878] hover:text-[#242633] hover:bg-white/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Account Info if Authenticated */}
          {isAuthenticated && user && (
            <div className="p-4 rounded-2xl bg-white/80 border border-[#EEE8E3] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#686878] font-bold uppercase tracking-wider">
                  Connected Account
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#49C98A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#49C98A]"></span>
                </span>
              </div>

              <div className="font-extrabold text-sm text-[#242633] truncate">
                {user.name}
              </div>
              <div className="text-xs text-[#686878] truncate font-medium">
                {user.email}
              </div>
              <div className="text-[11px] font-mono text-[#F07BAF] font-bold truncate pt-1">
                {truncateAddress(user.address)} • {user.balance || "2.45 ETH"}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? "nav-pill-active"
                      : "text-[#434553] hover:bg-white/80"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#686878]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-[#EEE8E3] space-y-3">
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs"
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
              className="w-full py-3 px-4 rounded-2xl brand-gradient hover:opacity-95 text-[#242633] text-xs font-extrabold transition-all shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)] flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 text-[#242633]" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Palette,
  Compass,
  ShieldCheck,
  HelpCircle,
  Shield,
  User,
  Sun,
  Moon,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { useTheme, useAuthModal } from "@/lib/providers";
import { useUserRole } from "@/hooks/useUserRole";
import { RoleBadge } from "@/components/ui/RoleBadge";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { openAuthModal } = useAuthModal();
  const { isConnected, roleHash, isDefaultAdmin } = useUserRole();

  if (!isOpen) return null;

  // Strict separation of guest vs curator links
  const navLinks = isConnected
    ? [
        { href: "/dashboard", label: "Curator Dashboard", icon: LayoutDashboard },
        { href: "/explore", label: "Explore Gallery", icon: Compass },
        { href: "/mint", label: "Register Artwork", icon: Palette },
        { href: "/verify", label: "Verify Authenticity", icon: ShieldCheck },
        { href: "/how-it-works", label: "How It Works", icon: HelpCircle },
        ...(isDefaultAdmin ? [{ href: "/admin", label: "Curator Admin", icon: Shield }] : []),
      ]
    : [
        { href: "/explore", label: "Explore Gallery", icon: Compass },
        { href: "/how-it-works", label: "How It Works", icon: HelpCircle },
      ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative ml-auto w-4/5 max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl animate-fade-in">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="font-extrabold text-lg text-slate-900 dark:text-white">
              Menu
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isConnected && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="text-xs text-slate-400 mb-1 font-medium">Active Curator Role</div>
              <RoleBadge roleHash={roleHash} />
            </div>
          )}

          <nav className="space-y-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {!isConnected && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  openAuthModal("login");
                }}
                type="button"
                className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/25 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Theme & Quick Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Interface Theme</span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

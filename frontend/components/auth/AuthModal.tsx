"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Wallet,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Zap,
  CheckCircle2,
  Palette,
  Landmark,
  Hammer,
  BadgeDollarSign,
  ShieldAlert,
} from "lucide-react";
import { useAuth, UserRole, ROLE_DEFAULTS } from "@/context/AuthContext";

export function AuthModal() {
  const router = useRouter();
  const { isAuthModalOpen, closeAuthModal, loginWithDemo, loginWithWallet } = useAuth();
  const { openConnectModal } = useConnectModal();
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();

  // Step state: "select" vs "demo-form"
  const [step, setStep] = useState<"select" | "demo-form">("select");

  // Selected role among the 5 roles
  const [selectedRole, setSelectedRole] = useState<UserRole>("Artist");

  // Form input state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setStep("select");
    closeAuthModal();
  };

  // Option A: Real Web3 Wallet
  const handleConnectWeb3 = () => {
    if (openConnectModal) {
      openConnectModal();
    } else if (isWagmiConnected && wagmiAddress) {
      loginWithWallet(wagmiAddress, selectedRole);
    }
  };

  // Role selector definitions
  const roles: { id: UserRole; title: string; subtitle: string; icon: any }[] = [
    {
      id: "Artist",
      title: "Genesis Artist",
      subtitle: "Creator & Minting Authority",
      icon: Palette,
    },
    {
      id: "Gallery",
      title: "Certified Gallery",
      subtitle: "Custody & International Loans",
      icon: Landmark,
    },
    {
      id: "Restorer",
      title: "Forensic Restorer",
      subtitle: "Conservation & Condition Reports",
      icon: Hammer,
    },
    {
      id: "Appraiser",
      title: "Fine Art Appraiser",
      subtitle: "Certified Valuations & Insurance",
      icon: BadgeDollarSign,
    },
    {
      id: "Admin",
      title: "Protocol Admin",
      subtitle: "Root Governance & Institutional Grants",
      icon: ShieldAlert,
    },
  ];

  // Auto-fill credentials based on selected role
  const handleAutofill = (role: UserRole = selectedRole) => {
    const def = ROLE_DEFAULTS[role];
    setName(def.name);
    setEmail(def.email);
    setPassword("demo2026pin");
  };

  // When switching role in form, update inputs if currently empty or autofilled
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    handleAutofill(role);
  };

  // Option B: Demo Wallet Submit
  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const def = ROLE_DEFAULTS[selectedRole];
      await loginWithDemo({
        name: name.trim() || def.name,
        email: email.trim() || def.email,
        role: selectedRole,
        password,
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentRoleDef = ROLE_DEFAULTS[selectedRole];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* High-end warm backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#242633]/40 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Glass Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg glass-modal rounded-3xl p-6 sm:p-8 z-10 text-[#242633] max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-xl text-[#686878] hover:text-[#242633] hover:bg-white/70 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-11 h-11 rounded-2xl brand-gradient text-[#242633] flex items-center justify-center shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-[#242633] leading-tight">
              Sign In to ArtLedger
            </h3>
            <p className="text-xs text-[#686878] font-medium mt-0.5">
              Access your fine art collection & role-gated provenance registry
            </p>
          </div>
        </div>

        {/* STEP 1: INITIAL METHOD SELECTION */}
        {step === "select" && (
          <div className="space-y-4">
            <p className="text-xs text-[#686878] leading-relaxed">
              Choose your authentication method to access the ArtLedger workspace:
            </p>

            {/* Option A: Connect to a Wallet */}
            <div className="p-4 rounded-2xl border border-[#EEE8E3] bg-white/70 hover:border-[#DBBA95] hover:bg-white/90 transition-all shadow-xs">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F7F3F0] text-[#242633] flex items-center justify-center border border-[#EEE8E3]">
                    <Wallet className="w-4 h-4 text-[#DBBA95]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#242633]">
                      Connect to a Wallet
                    </h4>
                    <span className="text-[11px] text-[#686878]">
                      MetaMask, Coinbase Wallet, WalletConnect
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#686878] mb-3 leading-relaxed">
                Connect your real Web3 browser extension to sign on-chain transactions and manage your art portfolio.
              </p>

              <button
                type="button"
                onClick={handleConnectWeb3}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F7F3F0] border border-[#EEE8E3] text-[#242633] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs hover:scale-[1.01]"
              >
                <span>Connect Browser Wallet</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#686878]" />
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-3">
              <div className="w-full border-t border-[#EEE8E3]" />
              <span className="absolute px-3 bg-white/90 text-[10px] font-bold text-[#686878] uppercase tracking-wider rounded-full border border-[#EEE8E3]">
                Or Instant Demo Access
              </span>
            </div>

            {/* Option B: Demo Wallet */}
            <div className="p-4 rounded-2xl border-2 border-[#FABED7]/70 bg-gradient-to-br from-white/95 via-[#FABED7]/15 to-[#F07BAF]/10 hover:border-[#F07BAF]/80 transition-all shadow-xs">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl brand-gradient text-[#242633] flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(240,123,175,0.4)]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#242633]">
                        Demo Wallet
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold brand-gradient text-[#242633]">
                        5 Roles Available
                      </span>
                    </div>
                    <span className="text-[11px] text-[#F07BAF] font-semibold">
                      Sandbox wallet — Select any curator role
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#686878] mb-3 leading-relaxed">
                Explore the complete dashboard as an Artist, Gallery, Restorer, Appraiser, or Admin instantly without installing MetaMask.
              </p>

              <button
                type="button"
                onClick={() => {
                  setStep("demo-form");
                  handleAutofill("Artist");
                }}
                className="w-full py-2.5 px-4 rounded-xl brand-gradient hover:opacity-95 text-[#242633] text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)] hover:scale-[1.01]"
              >
                <span>Continue with Demo Wallet</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#242633]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DEMO WALLET CREDENTIAL FORM & ROLE SELECTOR */}
        {step === "demo-form" && (
          <form onSubmit={handleDemoSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEE8E3]">
              <button
                type="button"
                onClick={() => setStep("select")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#686878] hover:text-[#242633] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Options</span>
              </button>

              <button
                type="button"
                onClick={() => handleAutofill(selectedRole)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/80 border border-[#EEE8E3] text-[#242633] hover:border-[#DBBA95] text-[11px] font-bold transition-all shadow-2xs"
              >
                <Zap className="w-3 h-3 text-[#DBBA95]" />
                <span>Auto-fill Role Credentials</span>
              </button>
            </div>

            {/* Select Role Section (The 5 Roles) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#242633] block">
                Select Your Role (5 Distinct Roles) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleSelectRole(r.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? "border-[#F07BAF] bg-[#FABED7]/25 shadow-xs ring-1 ring-[#F07BAF]"
                          : "border-[#EEE8E3] bg-white/60 hover:bg-white text-[#686878]"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "brand-gradient text-[#242633] shadow-xs"
                            : "bg-[#F7F3F0] text-[#686878] border border-[#EEE8E3]"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold truncate ${
                            isSelected ? "text-[#242633]" : "text-[#434553]"
                          }`}
                        >
                          {r.title}
                        </p>
                        <p className="text-[10px] text-[#686878] truncate">
                          {r.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full Name / Curator ID Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#242633] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#686878]" />
                <span>Full Name / Curator ID *</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={currentRoleDef.name}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE8E3] bg-white/80 text-xs sm:text-sm text-[#242633] placeholder:text-[#686878]/60 focus:outline-none focus:ring-2 focus:ring-[#FABED7]/40 focus:border-[#F07BAF] transition-all font-medium"
              />
            </div>

            {/* Email Address Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#242633] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#686878]" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={currentRoleDef.email}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE8E3] bg-white/80 text-xs sm:text-sm text-[#242633] placeholder:text-[#686878]/60 focus:outline-none focus:ring-2 focus:ring-[#FABED7]/40 focus:border-[#F07BAF] transition-all font-medium"
              />
            </div>

            {/* Access PIN / Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#242633] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#686878]" />
                <span>Password / Access PIN *</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE8E3] bg-white/80 text-xs sm:text-sm text-[#242633] placeholder:text-[#686878]/60 focus:outline-none focus:ring-2 focus:ring-[#FABED7]/40 focus:border-[#F07BAF] transition-all font-medium"
              />
            </div>

            {/* Role Address Preview */}
            <div className="p-3 rounded-2xl bg-white/70 border border-[#EEE8E3] text-xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#686878] block">
                  {selectedRole} Ethereum Address
                </span>
                <span className="font-mono text-[#242633] font-semibold text-[11px]">
                  {currentRoleDef.address.slice(0, 10)}...{currentRoleDef.address.slice(-6)}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full font-medium border border-[#49C98A]/30 bg-[#49C98A]/10 px-2.5 py-0.5 text-xs text-[#1a7e4e]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#49C98A]" />
                {currentRoleDef.balance}
              </span>
            </div>

            {/* Action Button: Connect Wallet */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-2xl brand-gradient hover:opacity-95 text-[#242633] text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)] hover:scale-[1.01] disabled:opacity-50 mt-2"
            >
              <Wallet className="w-4 h-4 text-[#242633]" />
              <span>
                {isSubmitting
                  ? "Connecting..."
                  : `Connect as ${selectedRole} & Open Dashboard`}
              </span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
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
      {/* High-end clean backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Light Gallery Modal Card */}
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 animate-fade-in text-slate-900 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-slate-900 leading-tight">
              Sign In to ArtLedger
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Access your fine art collection & role-gated provenance registry
            </p>
          </div>
        </div>

        {/* STEP 1: INITIAL METHOD SELECTION */}
        {step === "select" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Choose your authentication method to access the ArtLedger dashboard:
            </p>

            {/* Option A: Connect to a Wallet */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-500/50 hover:bg-slate-50/60 transition-all shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Connect to a Wallet
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      MetaMask, Coinbase Wallet, WalletConnect
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Connect your real Web3 browser extension to sign on-chain transactions and manage your art portfolio.
              </p>

              <button
                type="button"
                onClick={handleConnectWeb3}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Connect Browser Wallet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="w-full border-t border-slate-200" />
              <span className="absolute px-3 bg-white text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Or Instant Demo Access
              </span>
            </div>

            {/* Option B: Demo Wallet */}
            <div className="p-4 rounded-xl border-2 border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50/70 transition-all shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">
                        Demo Wallet
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                        5 Roles Available
                      </span>
                    </div>
                    <span className="text-[11px] text-indigo-600 font-medium">
                      Sandbox wallet — Select any of the 5 roles
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Explore the complete dashboard as an Artist, Gallery, Restorer, Appraiser, or Admin instantly without installing MetaMask.
              </p>

              <button
                type="button"
                onClick={() => {
                  setStep("demo-form");
                  handleAutofill("Artist");
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
              >
                <span>Continue with Demo Wallet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DEMO WALLET CREDENTIAL FORM & ROLE SELECTOR */}
        {step === "demo-form" && (
          <form onSubmit={handleDemoSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setStep("select")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Options</span>
              </button>

              <button
                type="button"
                onClick={() => handleAutofill(selectedRole)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-[11px] font-bold transition-colors"
              >
                <Zap className="w-3 h-3" />
                <span>Auto-fill Role Credentials</span>
              </button>
            </div>

            {/* Select Role Section (The 5 Roles) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
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
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-600"
                          : "border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-slate-500 border border-slate-200"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold truncate ${
                            isSelected ? "text-indigo-950" : "text-slate-800"
                          }`}
                        >
                          {r.title}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
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
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Name / Curator ID *</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={currentRoleDef.name}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            {/* Email Address Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={currentRoleDef.email}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            {/* Access PIN / Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Password / Access PIN *</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            {/* Role Address Preview */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {selectedRole} Ethereum Address
                </span>
                <span className="font-mono text-slate-700 font-semibold text-[11px]">
                  {currentRoleDef.address.slice(0, 10)}...{currentRoleDef.address.slice(-6)}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {currentRoleDef.balance}
              </span>
            </div>

            {/* Action Button: Connect Wallet */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 mt-2"
            >
              <Wallet className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? "Connecting..."
                  : `Connect as ${selectedRole} & Open Dashboard`}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

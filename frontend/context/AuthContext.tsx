"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";
import { toast } from "sonner";

export type UserRole = "Artist" | "Gallery" | "Restorer" | "Appraiser" | "Admin";

export interface UserProfile {
  name: string;
  email: string;
  address: string;
  role: UserRole;
  authType: "demo" | "wallet";
  balance: string;
  connectedAt: string;
}

export const ROLE_DEFAULTS: Record<
  UserRole,
  { name: string; email: string; address: string; balance: string; title: string }
> = {
  Artist: {
    name: "Aria Thorne",
    email: "aria.thorne@artledger.eth",
    address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    balance: "4.50 ETH",
    title: "Genesis Creator",
  },
  Gallery: {
    name: "Galerie Louvre Contemporary",
    email: "curator@galerielouvre.com",
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    balance: "18.25 ETH",
    title: "Certified Gallery & Custodian",
  },
  Restorer: {
    name: "Dr. Julian Croft",
    email: "j.croft@conservation-lab.ox.ac.uk",
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    balance: "3.80 ETH",
    title: "Forensic Art Conservator",
  },
  Appraiser: {
    name: "Sotheby's Heritage Appraisals",
    email: "valuations@sothebys-heritage.com",
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    balance: "6.40 ETH",
    title: "Fine Art Valuation Authority",
  },
  Admin: {
    name: "Eleanor Vance",
    email: "eleanor.vance@artledger.io",
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    balance: "100.00 ETH",
    title: "Protocol Root Administrator",
  },
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: any) => void;
  closeAuthModal: () => void;
  loginWithDemo: (credentials: {
    name: string;
    email: string;
    role: UserRole;
    password?: string;
  }) => Promise<void>;
  loginWithWallet: (walletAddress: string, role?: UserRole) => Promise<void>;
  switchRole: (newRole: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "artledger_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();
  const { disconnect: disconnectWagmi } = useDisconnect();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        // ensure default role if old format
        if (!parsed.role) parsed.role = "Artist";
        setUser(parsed);
      }
    } catch (e) {
      console.error("Failed to restore user from storage:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync real Wagmi Web3 wallet connection if active
  useEffect(() => {
    if (isWagmiConnected && wagmiAddress) {
      setUser((prev) => {
        if (prev?.authType === "demo") return prev; // Do not overwrite active demo session
        const web3User: UserProfile = {
          name: "Web3 Curator",
          email: `${wagmiAddress.slice(0, 6)}...@web3.eth`,
          address: wagmiAddress,
          role: prev?.role || "Gallery",
          authType: "wallet",
          balance: "2.45 ETH",
          connectedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(web3User));
        return web3User;
      });
    }
  }, [isWagmiConnected, wagmiAddress]);

  const openAuthModal = useCallback((_mode?: any) => {
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Demo Wallet Login Flow with Selected Role
  const loginWithDemo = useCallback(
    async (credentials: {
      name: string;
      email: string;
      role: UserRole;
      password?: string;
    }) => {
      const roleDef = ROLE_DEFAULTS[credentials.role] || ROLE_DEFAULTS.Artist;
      const trimmedName = credentials.name.trim() || roleDef.name;
      const trimmedEmail = credentials.email.trim() || roleDef.email;

      const profile: UserProfile = {
        name: trimmedName,
        email: trimmedEmail,
        address: roleDef.address,
        role: credentials.role,
        authType: "demo",
        balance: roleDef.balance,
        connectedAt: new Date().toISOString(),
      };

      setUser(profile);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      } catch (e) {
        console.error("Failed to store user profile:", e);
      }

      setIsAuthModalOpen(false);
      toast.success(`${credentials.role} Demo Wallet Connected`);
      router.push("/dashboard");
    },
    [router]
  );

  // Real Web3 Wallet Login Flow
  const loginWithWallet = useCallback(
    async (walletAddress: string, role: UserRole = "Gallery") => {
      const profile: UserProfile = {
        name: "Web3 Curator",
        email: `${walletAddress.slice(0, 6)}...@web3.eth`,
        address: walletAddress,
        role,
        authType: "wallet",
        balance: "2.45 ETH",
        connectedAt: new Date().toISOString(),
      };

      setUser(profile);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      } catch (e) {
        console.error("Failed to store user profile:", e);
      }

      setIsAuthModalOpen(false);
      toast.success("Web3 Wallet Connected");
      router.push("/dashboard");
    },
    [router]
  );

  // Switch role dynamically within dashboard
  const switchRole = useCallback((newRole: UserRole) => {
    setUser((prev) => {
      if (!prev) return null;
      const roleDef = ROLE_DEFAULTS[newRole];
      const updated: UserProfile = {
        ...prev,
        role: newRole,
        name: roleDef.name,
        email: roleDef.email,
        address: roleDef.address,
        balance: roleDef.balance,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to update role in storage:", e);
      }
      toast.success(`Switched role to ${newRole}`);
      return updated;
    });
  }, []);

  // Logout Flow - Clears session and returns to "/"
  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear auth storage:", e);
    }

    if (isWagmiConnected) {
      disconnectWagmi();
    }

    toast.info("Signed out to landing page");
    router.replace("/");
  }, [isWagmiConnected, disconnectWagmi, router]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    loginWithDemo,
    loginWithWallet,
    switchRole,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

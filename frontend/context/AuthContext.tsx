"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";
import { toast } from "sonner";

export interface UserProfile {
  name: string;
  email: string;
  address: string;
  authType: "demo" | "wallet";
  balance: string;
  connectedAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: any) => void;
  closeAuthModal: () => void;
  loginWithDemo: (credentials: { name: string; email: string; password?: string }) => Promise<void>;
  loginWithWallet: (walletAddress: string) => Promise<void>;
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

  // Load persisted user on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
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
          name: "Web3 Collector",
          email: `${wagmiAddress.slice(0, 6)}...@web3.eth`,
          address: wagmiAddress,
          authType: "wallet",
          balance: "2.45 ETH",
          connectedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(web3User));
        return web3User;
      });
    }
  }, [isWagmiConnected, wagmiAddress]);

  const openAuthModal = useCallback((_mode?: "login" | "signup") => {
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Demo Wallet Login Flow
  const loginWithDemo = useCallback(
    async (credentials: { name: string; email: string; password?: string }) => {
      const trimmedName = credentials.name.trim() || "Alex Morgan";
      const trimmedEmail = credentials.email.trim() || "alex@example.com";
      const mockAddress = "0x71C857303f269aFcfF2a0EaA7Ac603Ac7399894B";

      const profile: UserProfile = {
        name: trimmedName,
        email: trimmedEmail,
        address: mockAddress,
        authType: "demo",
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
      toast.success("Demo Wallet Connected");
      router.push("/dashboard");
    },
    [router]
  );

  // Real Web3 Wallet Login Flow
  const loginWithWallet = useCallback(
    async (walletAddress: string) => {
      const profile: UserProfile = {
        name: "Web3 Collector",
        email: `${walletAddress.slice(0, 6)}...@web3.eth`,
        address: walletAddress,
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

  // Logout Flow
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

    toast.info("Wallet disconnected");
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

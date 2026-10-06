"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "./wagmi";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

// Re-export for backward-compatibility if any hook references useAuthModal
export function useAuthModal() {
  const { isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();
  return {
    isAuthModalOpen,
    openAuthModal: (mode?: "login" | "signup") => openAuthModal(mode),
    closeAuthModal,
    authModalMode: "login" as const,
  };
}

// Light theme context provider (Strict Light Mode)
type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Strictly enforce light mode
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: "#4f46e5",
            accentColorForeground: "white",
            borderRadius: "medium",
          })}
        >
          <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {} }}>
            <AuthProvider>
              {children}
              <AuthModal />
              <Toaster
                position="bottom-right"
                theme="light"
                richColors
                closeButton
              />
            </AuthProvider>
          </ThemeContext.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

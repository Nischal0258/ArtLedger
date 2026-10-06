"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "./wagmi";
import { Toaster } from "sonner";
import { AuthModal } from "@/components/auth/AuthModal";
import { DemoWalletProvider, useDemoWallet } from "./demoWallet";

export { useDemoWallet };

// Theme Context
type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// Auth Modal Context
interface AuthModalContextType {
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: "login" | "signup") => void;
  closeAuthModal: () => void;
  authModalMode: "login" | "signup";
}

const AuthModalContext = createContext<AuthModalContextType>({
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  authModalMode: "login",
});

export const useAuthModal = () => useContext(AuthModalContext);

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");

  const openAuthModal = (mode: "login" | "signup" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("artledger-theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("artledger-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={
            theme === "dark"
              ? darkTheme({
                  accentColor: "#7c3aed",
                  accentColorForeground: "white",
                  borderRadius: "medium",
                })
              : lightTheme({
                  accentColor: "#7c3aed",
                  accentColorForeground: "white",
                  borderRadius: "medium",
                })
          }
        >
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <DemoWalletProvider>
              <AuthModalContext.Provider
                value={{
                  isAuthModalOpen,
                  openAuthModal,
                  closeAuthModal,
                  authModalMode,
                }}
              >
                {children}
                <AuthModal
                  isOpen={isAuthModalOpen}
                  onClose={closeAuthModal}
                  initialMode={authModalMode}
                />
                <Toaster
                  position="bottom-right"
                  theme={theme}
                  richColors
                  closeButton
                />
              </AuthModalContext.Provider>
            </DemoWalletProvider>
          </ThemeContext.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

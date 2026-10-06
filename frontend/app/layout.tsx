import type { Metadata } from "next";
import "../styles/globals.css";
import { Providers } from "../lib/providers";

export const metadata: Metadata = {
  title: "ArtLedger — Immutable On-Chain Art Provenance Tracker",
  description: "Eliminate forgery and restore historical integrity with role-gated on-chain custody and restoration logging on Ethereum.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-slate-100 antialiased flex flex-col transition-colors duration-200">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "../styles/globals.css";
import { Providers } from "../lib/providers";
import { NavigationShell } from "@/components/layout/NavigationShell";

export const metadata: Metadata = {
  title: "ArtLedger — Immutable On-Chain Art Provenance Tracker",
  description: "Eliminate forgery and restore historical integrity with on-chain custody and restoration logging on Ethereum.",
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
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased flex flex-col font-sans">
        <Providers>
          <NavigationShell>{children}</NavigationShell>
        </Providers>
      </body>
    </html>
  );
}

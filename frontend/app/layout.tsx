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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F7F3F0] text-[#242633] antialiased flex flex-col font-sans selection:bg-[#FABED7]/50 selection:text-[#242633]">
        <Providers>
          <NavigationShell>{children}</NavigationShell>
        </Providers>
      </body>
    </html>
  );
}

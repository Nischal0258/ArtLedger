"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function NavigationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname?.startsWith("/dashboard");

  // On the standalone dashboard route, strictly hide public website Navbar & Footer
  if (isDashboardRoute) {
    return <main className="flex-1 flex flex-col w-full min-h-screen bg-[#eef2f6]">{children}</main>;
  }

  // On public pages (Landing, Explore, How It Works, Artwork detail)
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}

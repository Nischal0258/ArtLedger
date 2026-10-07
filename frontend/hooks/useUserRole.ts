"use client";

import { useAccount, useReadContract } from "wagmi";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "@/lib/contract";
import { ROLES } from "@/lib/constants";
import { useDemoWallet, DEMO_PERSONAS } from "@/lib/demoWallet";
import { useAuth } from "@/context/AuthContext";

export function useUserRole() {
  const { address: realAddress, isConnected: isRealConnected } = useAccount();
  const { user: authUser, isAuthenticated: isAuthAuthenticated } = useAuth();
  const {
    isDemoMode: isRawDemoMode,
    activePersona: rawPersona,
    demoAddress,
    switchDemoPersona,
    disconnectDemoWallet,
  } = useDemoWallet();

  const isDemoMode = authUser?.authType === "demo" || isRawDemoMode;
  const isConnected = isRealConnected || isAuthAuthenticated || isRawDemoMode;

  const effectiveRole = authUser?.role || rawPersona?.roleName || "Artist";

  const activePersona = isDemoMode
    ? DEMO_PERSONAS.find((p) => p.roleName.toLowerCase() === effectiveRole.toLowerCase()) || rawPersona || DEMO_PERSONAS[0]
    : null;

  const address = isDemoMode
    ? (authUser?.address || demoAddress || activePersona?.address || "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65")
    : realAddress;

  const { data: roleHash, isLoading, refetch } = useReadContract({
    address: ARTLEDGER_ADDRESS,
    abi: ARTLEDGER_ABI,
    functionName: "resolveCallerRole",
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !isDemoMode && isRealConnected && !!realAddress,
    },
  });

  const roleHashMap: Record<string, `0x${string}`> = {
    Admin: ROLES.DEFAULT_ADMIN,
    Artist: ROLES.ARTIST,
    Gallery: ROLES.GALLERY,
    Restorer: ROLES.RESTORER,
    Appraiser: ROLES.APPRAISER,
  };

  const resolvedRole = isDemoMode
    ? (roleHashMap[effectiveRole] || ROLES.ARTIST)
    : ((roleHash as string) || "0x0000000000000000000000000000000000000000000000000000000000000000");

  const isDefaultAdmin = isDemoMode
    ? effectiveRole === "Admin"
    : resolvedRole === ROLES.DEFAULT_ADMIN;

  const isArtist = isDemoMode
    ? effectiveRole === "Artist" || effectiveRole === "Admin"
    : resolvedRole === ROLES.ARTIST;

  const isGallery = isDemoMode
    ? effectiveRole === "Gallery" || effectiveRole === "Admin"
    : resolvedRole === ROLES.GALLERY;

  const isRestorer = isDemoMode
    ? effectiveRole === "Restorer" || effectiveRole === "Admin"
    : resolvedRole === ROLES.RESTORER;

  const isAppraiser = isDemoMode
    ? effectiveRole === "Appraiser" || effectiveRole === "Admin"
    : resolvedRole === ROLES.APPRAISER;

  const hasAnyRole = isConnected;

  return {
    address,
    isConnected,
    isRealConnected,
    isDemoMode,
    activePersona,
    switchDemoPersona,
    disconnectDemoWallet,
    roleHash: resolvedRole,
    isLoading: isDemoMode ? false : isLoading,
    isDefaultAdmin,
    isArtist,
    isGallery,
    isRestorer,
    isAppraiser,
    hasAnyRole,
    refetch,
  };
}

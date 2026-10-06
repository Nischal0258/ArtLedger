"use client";

import { useAccount, useReadContract } from "wagmi";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "@/lib/contract";
import { ROLES } from "@/lib/constants";
import { useDemoWallet } from "@/lib/demoWallet";

export function useUserRole() {
  const { address: realAddress, isConnected: isRealConnected } = useAccount();
  const {
    isDemoMode,
    activePersona,
    demoAddress,
    switchDemoPersona,
    disconnectDemoWallet,
  } = useDemoWallet();

  const isConnected = isRealConnected || isDemoMode;
  const address = isDemoMode ? (demoAddress || undefined) : realAddress;

  const { data: roleHash, isLoading, refetch } = useReadContract({
    address: ARTLEDGER_ADDRESS,
    abi: ARTLEDGER_ABI,
    functionName: "resolveCallerRole",
    args: address ? [address] : undefined,
    query: {
      enabled: !isDemoMode && isRealConnected && !!realAddress,
    },
  });

  const resolvedRole = isDemoMode && activePersona
    ? activePersona.roleHash
    : ((roleHash as string) || "0x0000000000000000000000000000000000000000000000000000000000000000");

  const isDefaultAdmin = isDemoMode && activePersona
    ? activePersona.roleName === "Admin"
    : resolvedRole === ROLES.DEFAULT_ADMIN;

  const isArtist = isDemoMode && activePersona
    ? activePersona.roleName === "Artist" || activePersona.roleName === "Admin"
    : resolvedRole === ROLES.ARTIST;

  const isGallery = isDemoMode && activePersona
    ? activePersona.roleName === "Gallery" || activePersona.roleName === "Admin"
    : resolvedRole === ROLES.GALLERY;

  const isRestorer = isDemoMode && activePersona
    ? activePersona.roleName === "Restorer" || activePersona.roleName === "Admin"
    : resolvedRole === ROLES.RESTORER;

  const isAppraiser = isDemoMode && activePersona
    ? activePersona.roleName === "Appraiser" || activePersona.roleName === "Admin"
    : resolvedRole === ROLES.APPRAISER;

  const hasAnyRole = isDemoMode
    ? true
    : resolvedRole !== "0x0000000000000000000000000000000000000000000000000000000000000000" || isDefaultAdmin;

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

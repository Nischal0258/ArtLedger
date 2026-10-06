"use client";

import { useAccount, useReadContract } from "wagmi";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "@/lib/contract";
import { ROLES } from "@/lib/constants";

export function useUserRole() {
  const { address, isConnected } = useAccount();

  const { data: roleHash, isLoading, refetch } = useReadContract({
    address: ARTLEDGER_ADDRESS,
    abi: ARTLEDGER_ABI,
    functionName: "resolveCallerRole",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
    },
  });

  const resolvedRole = (roleHash as string) || "0x0000000000000000000000000000000000000000000000000000000000000000";

  const isDefaultAdmin = resolvedRole === ROLES.DEFAULT_ADMIN;
  const isArtist = resolvedRole === ROLES.ARTIST;
  const isGallery = resolvedRole === ROLES.GALLERY;
  const isRestorer = resolvedRole === ROLES.RESTORER;
  const isAppraiser = resolvedRole === ROLES.APPRAISER;
  const hasAnyRole = resolvedRole !== "0x0000000000000000000000000000000000000000000000000000000000000000" || isDefaultAdmin;

  return {
    address,
    isConnected,
    roleHash: resolvedRole,
    isLoading,
    isDefaultAdmin,
    isArtist,
    isGallery,
    isRestorer,
    isAppraiser,
    hasAnyRole,
    refetch,
  };
}

"use client";

import { useReadContract } from "wagmi";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "@/lib/contract";

export interface ArtworkData {
  artistName: string;
  title: string;
  year: number;
  medium: string;
  imageHash: string;
  ipfsCID: string;
  mintedAt: bigint;
  mintedBy: string;
}

export function useArtwork(tokenId?: number | bigint | string) {
  const numericTokenId = tokenId !== undefined && tokenId !== "" ? BigInt(tokenId) : undefined;

  const { data, isLoading, error, refetch } = useReadContract({
    address: ARTLEDGER_ADDRESS,
    abi: ARTLEDGER_ABI,
    functionName: "getArtwork",
    args: numericTokenId !== undefined ? [numericTokenId] : undefined,
    query: {
      enabled: numericTokenId !== undefined,
    },
  });

  const artwork = data as ArtworkData | undefined;

  return {
    artwork,
    isLoading,
    error,
    refetch,
  };
}

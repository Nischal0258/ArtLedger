"use client";

import { useReadContract } from "wagmi";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "@/lib/contract";
import { MOCK_ARTWORKS } from "@/lib/mockArtworks";

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
  const idNumber = numericTokenId !== undefined ? Number(numericTokenId) : undefined;

  const { data, isLoading, error, refetch } = useReadContract({
    address: ARTLEDGER_ADDRESS,
    abi: ARTLEDGER_ABI,
    functionName: "getArtwork",
    args: numericTokenId !== undefined ? [numericTokenId] : undefined,
    query: {
      enabled: numericTokenId !== undefined,
    },
  });

  const onChainArtwork = data as ArtworkData | undefined;

  // Fallback to rich mock artwork if contract call returns undefined or errors
  const fallbackMock =
    idNumber !== undefined
      ? MOCK_ARTWORKS.find((a) => a.tokenId === idNumber)
      : undefined;

  const artwork: ArtworkData | undefined =
    onChainArtwork && onChainArtwork.title && onChainArtwork.title.trim() !== ""
      ? onChainArtwork
      : fallbackMock
      ? {
          artistName: fallbackMock.artistName,
          title: fallbackMock.title,
          year: fallbackMock.year,
          medium: fallbackMock.medium,
          imageHash: fallbackMock.imageHash,
          ipfsCID: fallbackMock.ipfsCID,
          mintedAt: fallbackMock.mintedAt,
          mintedBy: fallbackMock.mintedBy,
        }
      : undefined;

  return {
    artwork,
    isLoading: isLoading && !artwork,
    error,
    refetch,
  };
}

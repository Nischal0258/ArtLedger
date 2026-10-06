"use client";

import { useReadContract } from "wagmi";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "@/lib/contract";
import { EventType } from "@/lib/constants";

export interface CustodyEventData {
  eventType: EventType;
  actor: string;
  actorRole: string;
  timestamp: bigint;
  description: string;
  location: string;
}

export function useProvenance(tokenId?: number | bigint | string) {
  const numericTokenId = tokenId !== undefined && tokenId !== "" ? BigInt(tokenId) : undefined;

  const { data, isLoading, error, refetch } = useReadContract({
    address: ARTLEDGER_ADDRESS,
    abi: ARTLEDGER_ABI,
    functionName: "getProvenance",
    args: numericTokenId !== undefined ? [numericTokenId] : undefined,
    query: {
      enabled: numericTokenId !== undefined,
    },
  });

  const events = (data as CustodyEventData[] | undefined) || [];

  return {
    events,
    count: events.length,
    isLoading,
    error,
    refetch,
  };
}

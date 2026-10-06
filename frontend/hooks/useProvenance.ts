"use client";

import { useReadContract } from "wagmi";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "@/lib/contract";
import { EventType } from "@/lib/constants";
import { MOCK_PROVENANCE_EVENTS } from "@/lib/mockArtworks";

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
  const idNumber = numericTokenId !== undefined ? Number(numericTokenId) : undefined;

  const { data, isLoading, error, refetch } = useReadContract({
    address: ARTLEDGER_ADDRESS,
    abi: ARTLEDGER_ABI,
    functionName: "getProvenance",
    args: numericTokenId !== undefined ? [numericTokenId] : undefined,
    query: {
      enabled: numericTokenId !== undefined,
    },
  });

  const onChainEvents = (data as CustodyEventData[] | undefined) || [];
  const fallbackEvents =
    idNumber !== undefined && MOCK_PROVENANCE_EVENTS[idNumber]
      ? MOCK_PROVENANCE_EVENTS[idNumber]
      : [];

  const events = onChainEvents.length > 0 ? onChainEvents : fallbackEvents;

  return {
    events,
    count: events.length,
    isLoading: isLoading && events.length === 0,
    error,
    refetch,
  };
}

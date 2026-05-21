"use client";

import { useState } from "react";
import { useWatchContractEvent } from "wagmi";
import { dexContracts } from "@/lib/contracts";

export function usePoolEvents() {
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  useWatchContractEvent({
    ...dexContracts.pool,
    eventName: "Swap",
    onLogs: () => setLastEvent("Swap")
  });

  useWatchContractEvent({
    ...dexContracts.pool,
    eventName: "Mint",
    onLogs: () => setLastEvent("Mint")
  });

  useWatchContractEvent({
    ...dexContracts.pool,
    eventName: "Burn",
    onLogs: () => setLastEvent("Burn")
  });

  return { lastEvent };
}

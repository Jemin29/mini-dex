"use client";

import { useReadContracts } from "wagmi";
import { dexContracts } from "@/lib/contracts";
import { env } from "@/lib/env";

export function usePoolData() {
  const result = useReadContracts({
    contracts: [
      { ...dexContracts.pool, functionName: "getReserves", args: [] },
      { ...dexContracts.pool, functionName: "feeBps", args: [] },
      { ...dexContracts.pool, functionName: "token0", args: [] },
      { ...dexContracts.pool, functionName: "token1", args: [] }
    ],
    query: {
      enabled: Boolean(env.poolAddress),
      refetchInterval: 15_000,
      refetchOnWindowFocus: false,
      staleTime: 12_000,
      gcTime: 60_000,
      retry: 2,
      retryDelay: 1500
    }
  });

  const reserves = result.data?.[0]?.result as [bigint, bigint, number] | undefined;
  const feeBps = result.data?.[1]?.result as number | undefined;
  const token0 = result.data?.[2]?.result as string | undefined;
  const token1 = result.data?.[3]?.result as string | undefined;

  return {
    ...result,
    reserves,
    feeBps,
    token0,
    token1
  };
}

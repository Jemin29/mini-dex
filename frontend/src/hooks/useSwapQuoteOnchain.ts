"use client";

import { useMemo } from "react";
import { useReadContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { useSwapStore } from "@/state/swapStore";
import { dexContracts } from "@/lib/contracts";
import { useTokenList } from "@/hooks/useTokenList";
import { env } from "@/lib/env";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export function useSwapQuoteOnchain() {
  const { amountIn, tokenIn, tokenOut } = useSwapStore();
  const tokens = useTokenList();

  const fallbackIn = tokenIn || tokens[0];
  const fallbackOut = tokenOut || tokens[1];
  const debouncedAmount = useDebouncedValue(amountIn, 300);
  const parsedAmount = useMemo(() => {
    const value = Number(debouncedAmount);
    if (!Number.isFinite(value) || value <= 0) return 0n;
    return parseUnits(debouncedAmount, fallbackIn.decimals);
  }, [debouncedAmount, fallbackIn.decimals]);

  const sameToken = fallbackIn.address.toLowerCase() === fallbackOut.address.toLowerCase();

  const query = useReadContract({
    ...dexContracts.router,
    functionName: "getAmountOut",
    args: [fallbackIn.address, fallbackOut.address, parsedAmount],
    query: {
      enabled: Boolean(env.routerAddress && parsedAmount > 0n && !sameToken),
      retry: 2,
      retryDelay: 1500,
      staleTime: 10_000,
      gcTime: 60_000,
      refetchOnWindowFocus: false
    }
  });

  return {
    amountOut: query.data ? Number(formatUnits(query.data as bigint, fallbackOut.decimals)) : 0,
    isLoading: query.isLoading,
    error: query.error
  };
}

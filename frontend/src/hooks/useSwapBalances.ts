"use client";

import { useMemo } from "react";
import { useAccount, useReadContracts } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { dexContracts } from "@/lib/contracts";
import { useSwapStore } from "@/state/swapStore";
import { useTokenList } from "@/hooks/useTokenList";
import { env } from "@/lib/env";

export function useSwapBalances() {
  const { address } = useAccount();
  const { tokenIn, tokenOut, amountIn } = useSwapStore();
  const tokens = useTokenList();

  const fallbackIn = tokenIn || tokens[0];
  const fallbackOut = tokenOut || tokens[1];

  const parsedAmount = useMemo(() => {
    const value = Number(amountIn);
    if (!Number.isFinite(value) || value <= 0) return 0n;
    return parseUnits(amountIn, fallbackIn.decimals);
  }, [amountIn, fallbackIn.decimals]);

  const result = useReadContracts({
    contracts: [
      {
        ...dexContracts.erc20,
        address: fallbackIn.address as `0x${string}`,
        functionName: "balanceOf",
        args: [address as `0x${string}`]
      },
      {
        ...dexContracts.erc20,
        address: fallbackOut.address as `0x${string}`,
        functionName: "balanceOf",
        args: [address as `0x${string}`]
      },
      {
        ...dexContracts.erc20,
        address: fallbackIn.address as `0x${string}`,
        functionName: "allowance",
        args: [address as `0x${string}`, dexContracts.router.address]
      }
    ],
    query: {
      enabled: Boolean(address && env.routerAddress),
      staleTime: 10_000,
      gcTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: 1200
    }
  });

  const balanceIn = result.data?.[0]?.result as bigint | undefined;
  const balanceOut = result.data?.[1]?.result as bigint | undefined;
  const allowance = result.data?.[2]?.result as bigint | undefined;

  const formattedBalanceIn = balanceIn !== undefined
    ? Number(formatUnits(balanceIn, fallbackIn.decimals))
    : 0;
  const formattedBalanceOut = balanceOut !== undefined
    ? Number(formatUnits(balanceOut, fallbackOut.decimals))
    : 0;

  const needsApproval = parsedAmount > 0n ? (allowance ?? 0n) < parsedAmount : false;

  return {
    balanceIn: formattedBalanceIn,
    balanceOut: formattedBalanceOut,
    allowance: allowance ?? 0n,
    needsApproval,
    isLoading: result.isLoading,
    error: result.error
  };
}

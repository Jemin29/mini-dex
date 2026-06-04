"use client";

import { useMemo } from "react";
import { useAccount, useReadContracts } from "wagmi";
import { formatUnits, type Abi } from "viem";
import { dexContracts } from "@/lib/contracts";
import type { Token } from "@/types/tokens";
import { env } from "@/lib/env";

type ContractCall = {
  abi: Abi;
  address: `0x${string}`;
  functionName: string;
  args: readonly unknown[];
};

export function useLiquidityBalances(tokenA?: Token, tokenB?: Token, lpToken?: string) {
  const { address } = useAccount();

  const contracts = useMemo(() => {
    const calls: ContractCall[] = [];
    const walletAddr = address as `0x${string}`;
    const routerAddr = dexContracts.router.address;
    const abi = dexContracts.erc20.abi as Abi;

    if (tokenA) {
      calls.push({
        abi,
        address: tokenA.address as `0x${string}`,
        functionName: "balanceOf",
        args: [walletAddr]
      });
    }
    if (tokenB) {
      calls.push({
        abi,
        address: tokenB.address as `0x${string}`,
        functionName: "balanceOf",
        args: [walletAddr]
      });
    }
    if (tokenA) {
      calls.push({
        abi,
        address: tokenA.address as `0x${string}`,
        functionName: "allowance",
        args: [walletAddr, routerAddr]
      });
    }
    if (tokenB) {
      calls.push({
        abi,
        address: tokenB.address as `0x${string}`,
        functionName: "allowance",
        args: [walletAddr, routerAddr]
      });
    }
    if (lpToken) {
      calls.push({
        abi,
        address: lpToken as `0x${string}`,
        functionName: "balanceOf",
        args: [walletAddr]
      });
      calls.push({
        abi,
        address: lpToken as `0x${string}`,
        functionName: "allowance",
        args: [walletAddr, routerAddr]
      });
      calls.push({
        abi,
        address: lpToken as `0x${string}`,
        functionName: "totalSupply",
        args: []
      });
    }

    return calls;
  }, [address, tokenA, tokenB, lpToken]);

  const result = useReadContracts({
    contracts,
    query: {
      enabled: Boolean(address && env.routerAddress && tokenA && tokenB),
      staleTime: 10_000,
      gcTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: 1200
    }
  });

  const [
    balanceA,
    balanceB,
    allowanceA,
    allowanceB,
    lpBalance,
    lpAllowance,
    lpTotalSupply
  ] = result.data?.map((entry) => entry?.result) || [];

  const formattedBalanceA = useMemo(() => {
    if (!tokenA || balanceA === undefined) return 0;
    return Number(formatUnits(balanceA as bigint, tokenA.decimals));
  }, [balanceA, tokenA]);

  const formattedBalanceB = useMemo(() => {
    if (!tokenB || balanceB === undefined) return 0;
    return Number(formatUnits(balanceB as bigint, tokenB.decimals));
  }, [balanceB, tokenB]);

  const formattedLpBalance = useMemo(() => {
    if (!lpBalance) return 0;
    return Number(formatUnits(lpBalance as bigint, 18));
  }, [lpBalance]);

  const formattedLpTotal = useMemo(() => {
    if (!lpTotalSupply) return 0;
    return Number(formatUnits(lpTotalSupply as bigint, 18));
  }, [lpTotalSupply]);

  return {
    balanceA: formattedBalanceA,
    balanceB: formattedBalanceB,
    allowanceA: (allowanceA as bigint | undefined) ?? 0n,
    allowanceB: (allowanceB as bigint | undefined) ?? 0n,
    lpBalance: formattedLpBalance,
    lpAllowance: (lpAllowance as bigint | undefined) ?? 0n,
    lpTotalSupply: formattedLpTotal,
    isLoading: result.isLoading,
    error: result.error
  };
}

"use client";

import { useMemo } from "react";
import { useWatchContractEvent, useAccount } from "wagmi";
import { formatUnits } from "viem";
import { dexContracts } from "@/lib/contracts";
import { useTokenList } from "@/hooks/useTokenList";
import { useTxStore } from "@/state/txStore";
import type { TransactionHistoryItem } from "@/types/tx";
import { useLiquidityPoolData } from "@/hooks/useLiquidityPoolData";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useHistoryEvents(onlyMyWallet: boolean) {
  const { address } = useAccount();
  const { addHistory } = useTxStore();
  const pool = useLiquidityPoolData();
  const tokens = useTokenList();

  const tokenMap = useMemo(() => {
    const entries = tokens.map((token) => [token.address.toLowerCase(), token]);
    return new Map(entries);
  }, [tokens]);

  const resolveSymbol = (addr?: string) => {
    if (!addr) return "UNKNOWN";
    return tokenMap.get(addr.toLowerCase())?.symbol || `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const handleHistory = (item: TransactionHistoryItem) => {
    if (onlyMyWallet && address && item.wallet && item.wallet.toLowerCase() !== address.toLowerCase()) {
      return;
    }
    addHistory(item);
  };

  useWatchContractEvent({
    ...dexContracts.pool,
    eventName: "Swap",
    onLogs: (logs) => {
      logs.forEach((log) => {
        const args = log.args as {
          sender: string;
          tokenIn: string;
          tokenOut: string;
          amountIn: bigint;
          amountOut: bigint;
          to: string;
        };
        handleHistory({
          id: createId(),
          type: "Swap",
          tokenIn: resolveSymbol(args.tokenIn),
          tokenOut: resolveSymbol(args.tokenOut),
          amountIn: formatUnits(args.amountIn, tokenMap.get(args.tokenIn.toLowerCase())?.decimals || 18),
          amountOut: formatUnits(args.amountOut, tokenMap.get(args.tokenOut.toLowerCase())?.decimals || 18),
          status: "confirmed",
          timestamp: new Date().toLocaleTimeString(),
          hash: log.transactionHash,
          wallet: args.to,
          source: "onchain",
          createdAt: Date.now()
        });
      });
    }
  });

  useWatchContractEvent({
    ...dexContracts.pool,
    eventName: "Mint",
    onLogs: (logs) => {
      logs.forEach((log) => {
        const args = log.args as {
          sender: string;
          to: string;
          amount0: bigint;
          amount1: bigint;
          liquidity: bigint;
        };
        const token0Symbol = resolveSymbol(pool.token0);
        const token1Symbol = resolveSymbol(pool.token1);
        handleHistory({
          id: createId(),
          type: "Add",
          tokenIn: token0Symbol,
          tokenOut: token1Symbol,
          amountIn: formatUnits(args.amount0, tokenMap.get(pool.token0?.toLowerCase() || "")?.decimals || 18),
          amountOut: formatUnits(args.amount1, tokenMap.get(pool.token1?.toLowerCase() || "")?.decimals || 18),
          status: "confirmed",
          timestamp: new Date().toLocaleTimeString(),
          hash: log.transactionHash,
          wallet: args.to,
          source: "onchain",
          createdAt: Date.now()
        });
      });
    }
  });

  useWatchContractEvent({
    ...dexContracts.pool,
    eventName: "Burn",
    onLogs: (logs) => {
      logs.forEach((log) => {
        const args = log.args as {
          sender: string;
          to: string;
          amount0: bigint;
          amount1: bigint;
          liquidity: bigint;
        };
        const token0Symbol = resolveSymbol(pool.token0);
        const token1Symbol = resolveSymbol(pool.token1);
        handleHistory({
          id: createId(),
          type: "Remove",
          tokenIn: token0Symbol,
          tokenOut: token1Symbol,
          amountIn: formatUnits(args.amount0, tokenMap.get(pool.token0?.toLowerCase() || "")?.decimals || 18),
          amountOut: formatUnits(args.amount1, tokenMap.get(pool.token1?.toLowerCase() || "")?.decimals || 18),
          status: "confirmed",
          timestamp: new Date().toLocaleTimeString(),
          hash: log.transactionHash,
          wallet: args.to,
          source: "onchain",
          createdAt: Date.now()
        });
      });
    }
  });
}

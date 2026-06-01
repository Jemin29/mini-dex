"use client";

import { useMemo } from "react";
import { formatUnits } from "viem";
import { useSwapStore } from "@/state/swapStore";
import { useSwapQuoteOnchain } from "@/hooks/useSwapQuoteOnchain";
import { usePoolData } from "@/hooks/usePoolData";
import { useTokenList } from "@/hooks/useTokenList";

export function useSwapMetrics() {
  const { amountIn, slippage, tokenIn, tokenOut } = useSwapStore();
  const tokens = useTokenList();
  const pool = usePoolData();
  const quote = useSwapQuoteOnchain();

  const fallbackIn = tokenIn || tokens[0];
  const fallbackOut = tokenOut || tokens[1];
  const amountInValue = Number(amountIn);

  return useMemo(() => {
    const amountOut = quote.amountOut;
    const feeBps = pool.feeBps ?? 30;
    const fee = Number.isFinite(amountInValue) ? amountInValue * (feeBps / 10_000) : 0;

    let priceImpact = 0;
    if (pool.reserves && amountOut > 0 && amountInValue > 0 && pool.token0 && pool.token1) {
      const [reserve0, reserve1] = pool.reserves;
      const isToken0In = fallbackIn.address.toLowerCase() === pool.token0.toLowerCase();
      const reserveIn = isToken0In
        ? Number(formatUnits(reserve0, fallbackIn.decimals))
        : Number(formatUnits(reserve1, fallbackIn.decimals));
      const reserveOut = isToken0In
        ? Number(formatUnits(reserve1, fallbackOut.decimals))
        : Number(formatUnits(reserve0, fallbackOut.decimals));

      if (reserveIn > 0 && reserveOut > 0) {
        const spotPrice = reserveOut / reserveIn;
        const tradePrice = amountOut / amountInValue;
        priceImpact = Math.max(0, ((spotPrice - tradePrice) / spotPrice) * 100);
      }
    }

    const minOut = amountOut > 0 ? amountOut * (1 - slippage / 100) : 0;

    return {
      amountOut,
      fee,
      priceImpact,
      minOut,
      feeBps
    };
  }, [amountInValue, fallbackIn, fallbackOut, pool.feeBps, pool.reserves, pool.token0, pool.token1, quote.amountOut, slippage]);
}

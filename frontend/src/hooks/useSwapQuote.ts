import { useMemo } from "react";
import { useSwapStore } from "@/state/swapStore";

export function useSwapQuote() {
  const { amountIn, slippage } = useSwapStore();

  return useMemo(() => {
    const amount = Number(amountIn);
    if (!Number.isFinite(amount) || amount <= 0) {
      return { amountOut: 0, fee: 0, priceImpact: 0 };
    }

    const fee = amount * 0.003;
    const priceImpact = Math.min(0.6, amount / 2500);
    const amountOut = (amount - fee) * (1 - priceImpact) * (1 - slippage / 100);

    return { amountOut, fee, priceImpact: priceImpact * 100 };
  }, [amountIn, slippage]);
}

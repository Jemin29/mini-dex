"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSwapQuote } from "@/hooks/useSwapQuote";
import { useSwapQuoteOnchain } from "@/hooks/useSwapQuoteOnchain";
import { useSwapStore } from "@/state/swapStore";
import { formatNumber, formatPct } from "@/lib/format";

export default function SwapPreview() {
  const { amountOut, fee, priceImpact } = useSwapQuote();
  const onchainQuote = useSwapQuoteOnchain();
  const { amountIn } = useSwapStore();
  const hasAmount = Number(amountIn) > 0;
  const displayAmountOut = onchainQuote.amountOut > 0 ? onchainQuote.amountOut : amountOut;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasAmount ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-28" />
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">Estimated output</span>
              <span className="font-semibold">{formatNumber(displayAmountOut, 6)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Pricing source</span>
              <span>{onchainQuote.isLoading ? "Fetching" : "On-chain"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Liquidity provider fee</span>
              <span>{formatNumber(fee, 6)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Price impact</span>
              <span className="text-amber-400">{formatPct(priceImpact, 2)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

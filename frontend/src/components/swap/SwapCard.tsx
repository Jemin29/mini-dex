"use client";

import { ArrowDownUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import TokenSelect from "@/components/swap/TokenSelect";
import SlippageSettings from "@/components/swap/SlippageSettings";
import { useSwapStore } from "@/state/swapStore";
import TxProgressModal from "@/components/notifications/TxProgressModal";
import { useDexActions } from "@/hooks/useDexActions";
import { useSwapQuoteOnchain } from "@/hooks/useSwapQuoteOnchain";
import { useSwapMetrics } from "@/hooks/useSwapMetrics";
import { useSwapBalances } from "@/hooks/useSwapBalances";
import SwapConfirmModal from "@/components/swap/SwapConfirmModal";
import { formatNumber } from "@/lib/format";

export default function SwapCard() {
  const { amountIn, setAmountIn, swapTokens, tokenIn, tokenOut } = useSwapStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { swap, isPending, error, isReady } = useDexActions();
  const quote = useSwapQuoteOnchain();
  const metrics = useSwapMetrics();
  const balances = useSwapBalances();
  const amountInValue = Number(amountIn);
  const insufficientBalance = Number.isFinite(amountInValue) && amountInValue > balances.balanceIn;

  const amountOutMin = useMemo(() => {
    if (metrics.amountOut <= 0) return "0";
    return metrics.minOut.toFixed(6);
  }, [metrics.amountOut, metrics.minOut]);

  const tokensMatch = Boolean(tokenIn && tokenOut && tokenIn.address === tokenOut.address);
  const canSwap = Boolean(
    tokenIn && tokenOut && amountIn && amountInValue > 0 && isReady && !tokensMatch && !insufficientBalance
  );

  const handleSwap = async () => {
    if (!tokenIn || !tokenOut || !amountIn || !isReady) return;
    setConfirmOpen(false);
    setModalOpen(true);
    await swap({
      tokenIn,
      tokenOut,
      amountIn,
      amountOutMin,
      amountOut: metrics.amountOut.toFixed(6)
    });
  };

  return (
    <>
      <Card>
      <CardHeader>
        <CardTitle>Swap</CardTitle>
        <CardDescription>Choose tokens and review the live preview before swapping.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <label className="text-xs uppercase tracking-[0.2em] text-muted">You pay</label>
          <div className="flex gap-3">
            <Input
              placeholder="0.00"
              value={amountIn}
              onChange={(event) => setAmountIn(event.target.value)}
            />
            <TokenSelect variant="in" />
          </div>
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Balance</span>
            <span>{formatNumber(balances.balanceIn, 6)} {tokenIn?.symbol || ""}</span>
          </div>
        </div>

        <button
          onClick={swapTokens}
          className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition hover:text-foreground"
        >
          <ArrowDownUp size={18} />
        </button>

        <div className="space-y-3">
          <label className="text-xs uppercase tracking-[0.2em] text-muted">You receive</label>
          <div className="flex gap-3">
            <Input placeholder="0.00" value={metrics.amountOut > 0 ? metrics.amountOut.toFixed(6) : ""} disabled />
            <TokenSelect variant="out" />
          </div>
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Balance</span>
            <span>{formatNumber(balances.balanceOut, 6)} {tokenOut?.symbol || ""}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <SlippageSettings />
          <span className="text-xs text-muted">Fees included</span>
        </div>

        {tokensMatch && <p className="text-xs text-red-300">Select two different tokens.</p>}
        {insufficientBalance && <p className="text-xs text-red-300">Insufficient balance.</p>}
        {error && <p className="text-xs text-red-300">{error}</p>}
        {quote.error && <p className="text-xs text-red-300">Unable to fetch on-chain quote.</p>}

        <Button
          size="lg"
          className="w-full"
          onClick={() => setConfirmOpen(true)}
          disabled={!canSwap || isPending}
        >
          {isPending ? "Submitting..." : "Review swap"}
        </Button>
      </CardContent>
      </Card>
      <TxProgressModal open={modalOpen} onOpenChange={setModalOpen} />
      <SwapConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleSwap}
        isSubmitting={isPending}
      />
    </>
  );
}

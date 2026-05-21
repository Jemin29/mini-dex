"use client";

import { ArrowDownUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import TokenSelect from "@/components/swap/TokenSelect";
import SlippageSettings from "@/components/swap/SlippageSettings";
import { useSwapStore } from "@/state/swapStore";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import TxProgressModal from "@/components/notifications/TxProgressModal";
import { useDexActions } from "@/hooks/useDexActions";
import { useSwapQuoteOnchain } from "@/hooks/useSwapQuoteOnchain";

export default function SwapCard() {
  const { amountIn, setAmountIn, swapTokens, tokenIn, tokenOut, slippage } = useSwapStore();
  const { notify } = useTxNotifications();
  const [modalOpen, setModalOpen] = useState(false);
  const { swap, isPending, error, isReady } = useDexActions();
  const quote = useSwapQuoteOnchain();

  const handleSwap = async () => {
    if (!tokenIn || !tokenOut || !amountIn || !isReady) return;
    const amountOutMin = quote.amountOut > 0
      ? (quote.amountOut * (1 - slippage / 100)).toFixed(6)
      : "0";

    notify({
      id: crypto.randomUUID(),
      title: "Swap submitted",
      status: "pending",
      timestamp: new Date().toLocaleTimeString()
    });
    setModalOpen(true);
    await swap(tokenIn.address, tokenOut.address, amountIn, amountOutMin, tokenIn.decimals, tokenOut.decimals);
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
            <Input placeholder="0.00" disabled />
            <TokenSelect variant="out" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <SlippageSettings />
          <span className="text-xs text-muted">Fees included</span>
        </div>

        {error && <p className="text-xs text-red-300">{error}</p>}

        <Button size="lg" className="w-full" onClick={handleSwap} disabled={!isReady || isPending}>
          {isPending ? "Submitting..." : "Swap tokens"}
        </Button>
      </CardContent>
      </Card>
      <TxProgressModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}

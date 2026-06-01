"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSwapStore } from "@/state/swapStore";
import { useSwapMetrics } from "@/hooks/useSwapMetrics";
import { useSwapBalances } from "@/hooks/useSwapBalances";
import { useSwapGasEstimate } from "@/hooks/useSwapGasEstimate";
import { formatNumber, formatPct } from "@/lib/format";

type SwapConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
};

export default function SwapConfirmModal({ open, onOpenChange, onConfirm, isSubmitting }: SwapConfirmModalProps) {
  const { tokenIn, tokenOut, amountIn } = useSwapStore();
  const { amountOut, minOut, priceImpact } = useSwapMetrics();
  const { needsApproval } = useSwapBalances();
  const gas = useSwapGasEstimate(minOut.toString(), tokenIn?.decimals || 18, tokenOut?.decimals || 18);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm swap</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">You pay</p>
            <p className="text-lg font-semibold text-foreground">
              {amountIn || "0"} {tokenIn?.symbol || ""}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">You receive (est.)</p>
            <p className="text-lg font-semibold text-foreground">
              {formatNumber(amountOut, 6)} {tokenOut?.symbol || ""}
            </p>
          </div>
          <div className="grid gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted">Minimum received</span>
              <span className="text-foreground">
                {formatNumber(minOut, 6)} {tokenOut?.symbol || ""}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Price impact</span>
              <span className="text-amber-400">{formatPct(priceImpact, 2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Gas estimate</span>
              <span className="text-foreground">{gas.isLoading ? "Estimating..." : gas.gasLimit}</span>
            </div>
            {needsApproval && (
              <div className="flex items-center justify-between text-amber-300">
                <span>Approval required</span>
                <span>1 signature</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="w-full" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Confirm swap"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

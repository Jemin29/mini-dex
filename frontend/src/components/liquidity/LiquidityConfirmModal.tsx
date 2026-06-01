"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLiquidityStore } from "@/state/liquidityStore";
import { useLiquidityMetrics } from "@/hooks/useLiquidityMetrics";
import { useLiquidityBalances } from "@/hooks/useLiquidityBalances";
import { formatNumber, formatPct } from "@/lib/format";

type LiquidityConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "remove";
  onConfirm: () => void;
  isSubmitting: boolean;
  lpToken?: string;
  lpTotalSupply?: number;
};

export default function LiquidityConfirmModal({
  open,
  onOpenChange,
  mode,
  onConfirm,
  isSubmitting,
  lpToken,
  lpTotalSupply
}: LiquidityConfirmModalProps) {
  const { tokenA, tokenB, amountA, amountB, lpAmount } = useLiquidityStore();
  const metrics = useLiquidityMetrics(lpTotalSupply);
  const balances = useLiquidityBalances(tokenA, tokenB, lpToken);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Confirm add liquidity" : "Confirm remove liquidity"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted">
          {mode === "add" ? (
            <>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Deposits</p>
                <p className="text-foreground">
                  {amountA || "0"} {tokenA?.symbol} + {amountB || "0"} {tokenB?.symbol}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">LP tokens (est.)</p>
                <p className="text-foreground">{formatNumber(metrics.expectedLiquidity, 6)} mLP</p>
              </div>
              <div className="grid gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Minimum received</span>
                  <span className="text-foreground">
                    {formatNumber(metrics.minAmountA, 6)} {tokenA?.symbol} · {formatNumber(metrics.minAmountB, 6)} {tokenB?.symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Pool APR (est.)</span>
                  <span className="text-accent">{formatPct(metrics.feeApr, 2)}</span>
                </div>
              </div>
              {(balances.allowanceA === 0n || balances.allowanceB === 0n) && (
                <div className="text-xs text-amber-300">Approval required before deposit.</div>
              )}
            </>
          ) : (
            <>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">LP tokens</p>
                <p className="text-foreground">{lpAmount || "0"} mLP</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Estimated withdrawal</p>
                <p className="text-foreground">
                  {formatNumber(metrics.removeAmountA, 6)} {tokenA?.symbol} · {formatNumber(metrics.removeAmountB, 6)} {tokenB?.symbol}
                </p>
              </div>
              {balances.lpAllowance === 0n && (
                <div className="text-xs text-amber-300">LP token approval required.</div>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="w-full" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : mode === "add" ? "Confirm add" : "Confirm remove"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

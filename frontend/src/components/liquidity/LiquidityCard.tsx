"use client";

import { ArrowDownUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LiquidityTokenSelect from "@/components/liquidity/LiquidityTokenSelect";
import LiquiditySlippageSettings from "@/components/liquidity/LiquiditySlippageSettings";
import LiquidityConfirmModal from "@/components/liquidity/LiquidityConfirmModal";
import { useLiquidityStore } from "@/state/liquidityStore";
import { useLiquidityPoolData } from "@/hooks/useLiquidityPoolData";
import { useLiquidityBalances } from "@/hooks/useLiquidityBalances";
import { useLiquidityMetrics } from "@/hooks/useLiquidityMetrics";
import { useLiquidityActions } from "@/hooks/useLiquidityActions";
import { useTokenList } from "@/hooks/useTokenList";
import { formatNumber } from "@/lib/format";

export default function LiquidityCard() {
  const tokens = useTokenList();
  const [tab, setTab] = useState("add");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [lastEdited, setLastEdited] = useState<"a" | "b" | null>(null);
  const {
    tokenA,
    tokenB,
    amountA,
    amountB,
    lpAmount,
    slippage,
    setTokenA,
    setTokenB,
    setAmountA,
    setAmountB,
    setLpAmount,
    swapTokens
  } = useLiquidityStore();

  const pool = useLiquidityPoolData();
  const balances = useLiquidityBalances(tokenA, tokenB, pool.lpToken);
  const metrics = useLiquidityMetrics(balances.lpTotalSupply);
  const { add, remove, error, isPending, isReady } = useLiquidityActions();

  useEffect(() => {
    const poolTokenA = pool.token0
      ? tokens.find((token) => token.address.toLowerCase() === pool.token0?.toLowerCase())
      : undefined;
    const poolTokenB = pool.token1
      ? tokens.find((token) => token.address.toLowerCase() === pool.token1?.toLowerCase())
      : undefined;

    if (!tokenA) setTokenA(poolTokenA || tokens[0]);
    if (!tokenB) setTokenB(poolTokenB || tokens[1]);
  }, [pool.token0, pool.token1, setTokenA, setTokenB, tokenA, tokenB, tokens]);

  useEffect(() => {
    if (!metrics.poolMatches || metrics.ratio === 0) return;

    if (lastEdited === "a") {
      const value = Number(amountA);
      if (!Number.isFinite(value) || value <= 0) {
        if (amountB) setAmountB("");
        return;
      }
      setAmountB(metrics.optimalAmountB.toFixed(6));
    }

    if (lastEdited === "b") {
      const value = Number(amountB);
      if (!Number.isFinite(value) || value <= 0) {
        if (amountA) setAmountA("");
        return;
      }
      setAmountA(metrics.optimalAmountA.toFixed(6));
    }
  }, [amountA, amountB, lastEdited, metrics.optimalAmountA, metrics.optimalAmountB, metrics.poolMatches, metrics.ratio, setAmountA, setAmountB]);

  const tokensMatch = Boolean(tokenA && tokenB && tokenA.address === tokenB.address);
  const insufficientA = Number(amountA) > balances.balanceA;
  const insufficientB = Number(amountB) > balances.balanceB;
  const insufficientLp = Number(lpAmount) > balances.lpBalance;
  const poolShareAfter = balances.lpTotalSupply > 0
    ? ((balances.lpBalance + metrics.expectedLiquidity) / (balances.lpTotalSupply + metrics.expectedLiquidity)) * 100
    : 100;

  const minA = useMemo(() => (Number(amountA) > 0 ? metrics.minAmountA.toFixed(6) : "0"), [amountA, metrics.minAmountA]);
  const minB = useMemo(() => (Number(amountB) > 0 ? metrics.minAmountB.toFixed(6) : "0"), [amountB, metrics.minAmountB]);

  const removeMinA = useMemo(() => {
    const amount = metrics.removeAmountA * (1 - slippage / 100);
    return amount > 0 ? amount.toFixed(6) : "0";
  }, [metrics.removeAmountA, slippage]);

  const removeMinB = useMemo(() => {
    const amount = metrics.removeAmountB * (1 - slippage / 100);
    return amount > 0 ? amount.toFixed(6) : "0";
  }, [metrics.removeAmountB, slippage]);

  const canAdd = Boolean(
    tokenA && tokenB && Number(amountA) > 0 && Number(amountB) > 0 && !tokensMatch && metrics.poolMatches && !insufficientA && !insufficientB && isReady
  );
  const canRemove = Boolean(
    tokenA && tokenB && Number(lpAmount) > 0 && !insufficientLp && isReady && metrics.poolMatches
  );

  const handleAdd = async () => {
    if (!tokenA || !tokenB) return;
    setConfirmOpen(false);
    await add({ tokenA, tokenB, amountA, amountB, minA, minB });
  };

  const handleRemove = async () => {
    if (!tokenA || !tokenB || !pool.lpToken) return;
    setConfirmOpen(false);
    await remove({ tokenA, tokenB, lpToken: pool.lpToken, lpAmount, minA: removeMinA, minB: removeMinB });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Liquidity</CardTitle>
          <CardDescription>Add or remove liquidity with full slippage protection.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="add">Add</TabsTrigger>
              <TabsTrigger value="remove">Remove</TabsTrigger>
            </TabsList>

            <TabsContent value="add" className="mt-6 space-y-4">
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.2em] text-muted">Token A</label>
                <div className="flex gap-3">
                  <Input
                    placeholder="0.00"
                    value={amountA}
                    onChange={(event) => {
                      setLastEdited("a");
                      setAmountA(event.target.value);
                    }}
                  />
                  <LiquidityTokenSelect variant="a" />
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Balance</span>
                  <span>{formatNumber(balances.balanceA, 6)} {tokenA?.symbol || ""}</span>
                </div>
              </div>

              <button
                onClick={swapTokens}
                className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition hover:text-foreground"
                aria-label="Swap token order"
              >
                <ArrowDownUp size={18} />
              </button>

              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.2em] text-muted">Token B</label>
                <div className="flex gap-3">
                  <Input
                    placeholder="0.00"
                    value={amountB}
                    onChange={(event) => {
                      setLastEdited("b");
                      setAmountB(event.target.value);
                    }}
                  />
                  <LiquidityTokenSelect variant="b" />
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Balance</span>
                  <span>{formatNumber(balances.balanceB, 6)} {tokenB?.symbol || ""}</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-muted">
                <div className="flex items-center justify-between">
                  <span>Pool ratio</span>
                  <span>{metrics.ratio ? `${formatNumber(metrics.ratio, 6)} ${tokenB?.symbol} per ${tokenA?.symbol}` : "-"}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>LP tokens (est.)</span>
                  <span>{formatNumber(metrics.expectedLiquidity, 6)} mLP</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>Pool share after</span>
                  <span>{formatNumber(poolShareAfter, 4)}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <LiquiditySlippageSettings />
                <span className="text-xs text-muted">Min: {minA} / {minB}</span>
              </div>

              {!metrics.poolMatches && <p className="text-xs text-red-300">Pool not found for this pair.</p>}
              {tokensMatch && <p className="text-xs text-red-300">Select two different tokens.</p>}
              {insufficientA && <p className="text-xs text-red-300">Insufficient {tokenA?.symbol} balance.</p>}
              {insufficientB && <p className="text-xs text-red-300">Insufficient {tokenB?.symbol} balance.</p>}
              {error && <p className="text-xs text-red-300">{error}</p>}

              <Button size="lg" className="w-full" onClick={() => setConfirmOpen(true)} disabled={!canAdd || isPending}>
                {isPending ? "Submitting..." : "Review add"}
              </Button>
            </TabsContent>

            <TabsContent value="remove" className="mt-6 space-y-4">
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.2em] text-muted">LP tokens</label>
                <Input
                  placeholder="0.00"
                  value={lpAmount}
                  onChange={(event) => setLpAmount(event.target.value)}
                />
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Balance</span>
                  <span>{formatNumber(balances.lpBalance, 6)} mLP</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-muted">
                <div className="flex items-center justify-between">
                  <span>Estimated withdrawal</span>
                  <span>
                    {formatNumber(metrics.removeAmountA, 6)} {tokenA?.symbol} · {formatNumber(metrics.removeAmountB, 6)} {tokenB?.symbol}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>Minimum received</span>
                  <span>
                    {removeMinA} {tokenA?.symbol} · {removeMinB} {tokenB?.symbol}
                  </span>
                </div>
              </div>

              {!metrics.poolMatches && <p className="text-xs text-red-300">Pool not found for this pair.</p>}
              {insufficientLp && <p className="text-xs text-red-300">Insufficient LP token balance.</p>}
              {error && <p className="text-xs text-red-300">{error}</p>}

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setConfirmOpen(true)}
                disabled={!canRemove || isPending}
              >
                {isPending ? "Submitting..." : "Review remove"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <LiquidityConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        mode={tab === "add" ? "add" : "remove"}
        onConfirm={tab === "add" ? handleAdd : handleRemove}
        isSubmitting={isPending}
        lpToken={pool.lpToken}
        lpTotalSupply={balances.lpTotalSupply}
      />
    </>
  );
}

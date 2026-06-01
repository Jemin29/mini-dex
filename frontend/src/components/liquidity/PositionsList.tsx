"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import TokenLogo from "@/components/common/TokenLogo";
import { useTokenList } from "@/hooks/useTokenList";
import { useLiquidityPoolData } from "@/hooks/useLiquidityPoolData";
import { useLiquidityBalances } from "@/hooks/useLiquidityBalances";
import { useLiquidityMetrics } from "@/hooks/useLiquidityMetrics";
import { formatNumber, formatPct } from "@/lib/format";

export default function PositionsList() {
  const tokens = useTokenList();
  const pool = useLiquidityPoolData();
  const tokenA = tokens.find((token) => token.address.toLowerCase() === pool.token0?.toLowerCase()) || tokens[0];
  const tokenB = tokens.find((token) => token.address.toLowerCase() === pool.token1?.toLowerCase()) || tokens[1];
  const balances = useLiquidityBalances(tokenA, tokenB, pool.lpToken);
  const metrics = useLiquidityMetrics(balances.lpTotalSupply);
  const feeBps = pool.feeBps ?? 30;

  const poolShare = balances.lpTotalSupply > 0
    ? (balances.lpBalance / balances.lpTotalSupply) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your positions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pool.isLoading ? (
          <Skeleton className="h-20" />
        ) : balances.lpBalance <= 0 ? (
          <p className="text-sm text-muted">No active liquidity positions.</p>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <TokenLogo token={tokenA} size="sm" />
                  <TokenLogo token={tokenB} size="sm" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{tokenA?.symbol} / {tokenB?.symbol}</p>
                  <p className="text-xs text-muted">Pool share {formatPct(poolShare, 3)}</p>
                </div>
              </div>
              <Badge>{formatPct(metrics.feeApr, 2)} APR</Badge>
            </div>

            <div className="grid gap-3 rounded-xl border border-border px-4 py-3 text-xs text-muted sm:grid-cols-2">
              <div>
                <p className="uppercase tracking-[0.2em]">LP balance</p>
                <p className="text-sm text-foreground">{formatNumber(balances.lpBalance, 6)} mLP</p>
              </div>
              <div>
                <p className="uppercase tracking-[0.2em]">Total LP supply</p>
                <p className="text-sm text-foreground">{formatNumber(balances.lpTotalSupply, 2)} mLP</p>
              </div>
              <div>
                <p className="uppercase tracking-[0.2em]">Reserve {tokenA?.symbol}</p>
                <p className="text-sm text-foreground">{formatNumber(metrics.poolMatches ? metrics.reserveA : 0, 6)}</p>
              </div>
              <div>
                <p className="uppercase tracking-[0.2em]">Reserve {tokenB?.symbol}</p>
                <p className="text-sm text-foreground">{formatNumber(metrics.poolMatches ? metrics.reserveB : 0, 6)}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border px-4 py-3 text-xs text-muted">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span>Pool depth</span>
                <span>{formatNumber(metrics.reserveA, 4)} {tokenA?.symbol} · {formatNumber(metrics.reserveB, 4)} {tokenB?.symbol}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <span>Fee tier</span>
                <span>{feeBps} bps</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

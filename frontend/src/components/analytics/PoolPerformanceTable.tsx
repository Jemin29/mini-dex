import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PoolPerformance } from "@/types/analytics";
import { formatNumber, formatPct } from "@/lib/format";

export default function PoolPerformanceTable({ pools }: { pools: PoolPerformance[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pools.map((pool) => (
          <div key={pool.pair} className="grid items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm md:grid-cols-4">
            <div>
              <p className="font-semibold text-foreground">{pool.pair}</p>
              <p className="text-xs text-muted">TVL ${formatNumber(pool.tvl, 2)}B</p>
            </div>
            <p className="text-xs text-muted">24h vol ${formatNumber(pool.volume24h, 2)}B</p>
            <p className="text-xs text-accent">Fee APR {formatPct(pool.feeApr, 2)}</p>
            <p className={pool.performance7d >= 0 ? "text-emerald-400 text-xs" : "text-red-400 text-xs"}>
              7d {formatPct(pool.performance7d, 2)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

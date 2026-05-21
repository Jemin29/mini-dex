import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PoolStat } from "@/types/pool";
import PoolSparkline from "@/components/analytics/PoolSparkline";
import { usePoolData } from "@/hooks/usePoolData";

const pools: PoolStat[] = [
  { pair: "mA / mB", tvl: "$2.4M", volume24h: "$640k", feeApr: "12.4%" },
  { pair: "USDC / mB", tvl: "$1.1M", volume24h: "$310k", feeApr: "8.2%" },
  { pair: "USDC / mA", tvl: "$900k", volume24h: "$220k", feeApr: "6.7%" }
];

export default function PoolTable() {
  const { reserves } = usePoolData();
  const reserveText = useMemo(() => {
    const reserve0 = reserves?.[0] ? Number(reserves[0]) : 0;
    const reserve1 = reserves?.[1] ? Number(reserves[1]) : 0;
    return `R ${reserve0.toLocaleString()}/${reserve1.toLocaleString()}`;
  }, [reserves]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {pools.map((pool) => (
            <div key={pool.pair} className="grid items-center gap-3 rounded-xl border border-border px-4 py-3 md:grid-cols-5">
              <p className="text-sm font-semibold text-foreground">{pool.pair}</p>
              <p className="text-xs text-muted">TVL {pool.tvl}</p>
              <p className="text-xs text-muted">24h {pool.volume24h}</p>
              <p className="text-xs text-accent">Fee APR {pool.feeApr}</p>
              <div className="flex items-center justify-end gap-3">
                <span className="text-[10px] text-muted">{reserveText}</span>
                <PoolSparkline />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { cacheGetOrSet } from "@/cache/cache";
import { pools, transactions } from "@/data/store";
import type { AnalyticsSummary } from "@/types";

export async function getAnalyticsSummary() {
  return cacheGetOrSet("analytics:summary", 15, async () => {
    const tvl = pools.reduce((sum, pool) => sum + pool.tvl, 0);
    const volume24h = pools.reduce((sum, pool) => sum + pool.volume24h, 0);
    const activePools = pools.length;
    const swapCount24h = transactions.filter((tx) => tx.type === "Swap").length;

    const summary: AnalyticsSummary = {
      tvl,
      volume24h,
      activePools,
      swapCount24h
    };

    return summary;
  });
}

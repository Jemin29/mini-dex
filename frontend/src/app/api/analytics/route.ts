import { NextResponse } from "next/server";
import type { AnalyticsResponse, TimeSeriesPoint } from "@/types/analytics";

function buildSeries(base: number, variance: number, points = 24): TimeSeriesPoint[] {
  const now = Date.now();
  return Array.from({ length: points }).map((_, index) => {
    const time = new Date(now - (points - index - 1) * 60 * 60 * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
    const wave = Math.sin((index / points) * Math.PI * 2);
    const value = base + wave * variance + (index % 3) * (variance / 8);
    return { time, value: Number(value.toFixed(2)) };
  });
}

export async function GET() {
  const tvlSeries = buildSeries(42.8, 2.4);
  const volumeSeries = buildSeries(2.94, 0.6);
  const priceSeries = buildSeries(3214, 180);

  const response: AnalyticsResponse = {
    summary: {
      tvl: 42.8,
      volume24h: 2.94,
      activePools: 612,
      swapCount24h: 124_512
    },
    tvlSeries,
    volumeSeries,
    priceSeries,
    topTokens: [
      { symbol: "ETH", price: 3214.12, change24h: 2.3, volume24h: 1.2, liquidity: 18.4 },
      { symbol: "USDC", price: 1.0, change24h: 0.01, volume24h: 0.9, liquidity: 12.2 },
      { symbol: "ARB", price: 0.98, change24h: -0.4, volume24h: 0.3, liquidity: 4.1 },
      { symbol: "OP", price: 2.51, change24h: 3.1, volume24h: 0.4, liquidity: 3.5 }
    ],
    pools: [
      { pair: "ETH / USDC", tvl: 18.2, volume24h: 0.92, feeApr: 12.4, performance7d: 5.2 },
      { pair: "WBTC / ETH", tvl: 9.6, volume24h: 0.42, feeApr: 8.6, performance7d: 2.1 },
      { pair: "ARB / ETH", tvl: 4.2, volume24h: 0.22, feeApr: 6.7, performance7d: -1.4 }
    ],
    liquidityDistribution: [
      { name: "Blue chip", value: 46 },
      { name: "Stable pairs", value: 28 },
      { name: "L2 tokens", value: 16 },
      { name: "Long tail", value: 10 }
    ],
    recentTxs: [
      { hash: "0x9c4d...1f2a", type: "Swap", pair: "ETH / USDC", value: 124_000, time: "2m ago" },
      { hash: "0x2a8b...91ce", type: "Add", pair: "ARB / ETH", value: 48_200, time: "6m ago" },
      { hash: "0xb41c...7a13", type: "Remove", pair: "WBTC / ETH", value: 82_500, time: "11m ago" }
    ],
    portfolio: {
      netValue: 482_930,
      pnl24h: 4.8,
      positions: 6
    },
    wallet: {
      activeWallets: 1284,
      newWallets: 92,
      retention: 72
    },
    updatedAt: new Date().toISOString()
  };

  return NextResponse.json(response, { headers: { "Cache-Control": "no-store" } });
}

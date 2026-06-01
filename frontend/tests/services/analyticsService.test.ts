import { fetchAnalytics } from "@/services/analyticsService";
import { vi } from "vitest";

describe("analyticsService", () => {
  it("returns analytics payload", async () => {
    const mockResponse = {
      summary: {
        tvl: 1,
        volume24h: 1,
        activePools: 1,
        swapCount24h: 1
      },
      tvlSeries: [],
      volumeSeries: [],
      priceSeries: [],
      topTokens: [],
      pools: [],
      liquidityDistribution: [],
      recentTxs: [],
      portfolio: { netValue: 0, pnl24h: 0, positions: 0 },
      wallet: { activeWallets: 0, newWallets: 0, retention: 0 },
      updatedAt: "now"
    };

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    }));

    const res = await fetchAnalytics();
    expect(res.summary.activePools).toBe(1);
  });

  it("throws on failed response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(fetchAnalytics()).rejects.toThrow("Failed to load analytics data");
  });
});

import { GET } from "@/app/api/analytics/route";

describe("GET /api/analytics", () => {
  it("returns analytics payload", async () => {
    const res = await GET();
    const json = await res.json();

    expect(json.summary).toMatchObject({
      tvl: expect.any(Number),
      volume24h: expect.any(Number),
      activePools: expect.any(Number),
      swapCount24h: expect.any(Number)
    });
    expect(json.tvlSeries.length).toBeGreaterThan(0);
    expect(json.volumeSeries.length).toBeGreaterThan(0);
    expect(json.priceSeries.length).toBeGreaterThan(0);
    expect(json.updatedAt).toBeTypeOf("string");
  });
});

import request from "supertest";
import { createApp } from "@/app";

const app = createApp();

describe("Analytics API", () => {
  it("returns analytics summary", async () => {
    const res = await request(app).get("/api/analytics/summary").expect(200);

    expect(res.body.data).toMatchObject({
      tvl: expect.any(Number),
      volume24h: expect.any(Number),
      activePools: expect.any(Number),
      swapCount24h: expect.any(Number)
    });
    expect(res.body.updatedAt).toBeTypeOf("string");
  });

  it("adds request id header", async () => {
    const res = await request(app).get("/api/analytics/summary").expect(200);
    expect(res.headers["x-request-id"]).toBeTypeOf("string");
  });
});

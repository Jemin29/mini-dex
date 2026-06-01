import request from "supertest";
import { createApp } from "@/app";

const app = createApp();

describe("Meta endpoints", () => {
  it("returns health status", async () => {
    const res = await request(app).get("/api/health").expect(200);
    expect(res.body).toMatchObject({ status: "ok" });
    expect(res.body.timestamp).toBeTypeOf("number");
  });

  it("lists tokens and pools", async () => {
    const tokensRes = await request(app).get("/api/tokens").expect(200);
    expect(tokensRes.body.data).toEqual(expect.any(Array));

    const poolsRes = await request(app).get("/api/pools").expect(200);
    expect(poolsRes.body.data).toEqual(expect.any(Array));
  });

  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/api/does-not-exist").expect(404);
    expect(res.body.error?.message).toBe("Not Found");
  });
});

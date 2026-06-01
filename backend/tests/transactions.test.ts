import request from "supertest";
import { createApp } from "@/app";

const app = createApp();

describe("Transactions API", () => {
  it("paginates transactions", async () => {
    const res = await request(app).get("/api/transactions?page=1&pageSize=5").expect(200);

    expect(res.body).toMatchObject({
      items: expect.any(Array),
      total: expect.any(Number),
      page: 1,
      pageSize: 5
    });
    expect(res.body.updatedAt).toBeTypeOf("string");
  });
});

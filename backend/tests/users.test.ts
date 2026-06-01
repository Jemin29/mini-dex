import request from "supertest";
import { createApp } from "@/app";

const app = createApp();

describe("Users API", () => {
  it("returns wallet activity with pagination", async () => {
    const res = await request(app)
      .get("/api/users/0xabc/transactions?page=1&pageSize=10")
      .expect(200);

    expect(res.body).toMatchObject({
      items: expect.any(Array),
      total: expect.any(Number),
      page: 1,
      pageSize: 10,
      wallet: "0xabc"
    });
  });
});

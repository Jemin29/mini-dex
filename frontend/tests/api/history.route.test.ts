import { GET } from "@/app/api/history/route";

describe("GET /api/history", () => {
  it("filters by type and status", async () => {
    const req = new Request("http://localhost/api/history?type=Swap&status=confirmed&page=1&pageSize=5");
    const res = await GET(req);
    const json = await res.json();

    expect(json.items.every((item: any) => item.type === "Swap")).toBe(true);
    expect(json.items.every((item: any) => item.status === "confirmed")).toBe(true);
  });

  it("paginates results", async () => {
    const req = new Request("http://localhost/api/history?page=1&pageSize=1");
    const res = await GET(req);
    const json = await res.json();

    expect(json.page).toBe(1);
    expect(json.pageSize).toBe(1);
    expect(json.items.length).toBeLessThanOrEqual(1);
  });
});

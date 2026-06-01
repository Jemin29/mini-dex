import { fetchHistory } from "@/services/historyService";
import { vi } from "vitest";

describe("historyService", () => {
  it("returns history payload", async () => {
    const mockResponse = {
      items: [],
      page: 1,
      pageSize: 10,
      total: 0,
      updatedAt: "now"
    };

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    }));

    const res = await fetchHistory({ page: 1, pageSize: 10 });
    expect(res.total).toBe(0);
  });

  it("throws on failed response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(fetchHistory({ page: 1, pageSize: 10 })).rejects.toThrow("Failed to load history");
  });
});

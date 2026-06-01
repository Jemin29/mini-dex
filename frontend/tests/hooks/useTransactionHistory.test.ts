import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import { useTxStore } from "@/state/txStore";
import { createQueryWrapper } from "../utils";

const fetchHistoryMock = vi.fn();

vi.mock("@/services/historyService", () => ({
  fetchHistory: (...args: any[]) => fetchHistoryMock(...args)
}));

vi.mock("@/hooks/useHistoryEvents", () => ({
  useHistoryEvents: () => {}
}));

vi.mock("wagmi", () => ({
  useAccount: () => ({ address: "0xabc" })
}));

describe("useTransactionHistory", () => {
  beforeEach(() => {
    useTxStore.setState({ history: [], cachedHistory: [], lastSync: undefined });
  });

  it("merges cached and local history", async () => {
    useTxStore.setState({
      history: [
        {
          id: "local-1",
          type: "Swap",
          tokenIn: "ETH",
          tokenOut: "USDC",
          amountIn: "1",
          amountOut: "3000",
          status: "confirmed",
          timestamp: "now",
          source: "local",
          createdAt: 2000,
          wallet: "0xabc"
        }
      ]
    });

    fetchHistoryMock.mockResolvedValue({
      items: [
        {
          id: "api-1",
          type: "Add",
          tokenIn: "ETH",
          tokenOut: "USDC",
          amountIn: "2",
          amountOut: "6000",
          status: "confirmed",
          timestamp: "earlier",
          source: "api",
          createdAt: 1000,
          wallet: "0xabc"
        }
      ],
      page: 1,
      pageSize: 10,
      total: 1,
      updatedAt: "now"
    });

    const wrapper = createQueryWrapper();
    const { result } = renderHook(() => useTransactionHistory(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data.length).toBe(2);
    expect(result.current.data[0].id).toBe("local-1");
  });
});

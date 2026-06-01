import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useWallet } from "@/hooks/useWallet";
import { useWalletActions } from "@/hooks/useWalletActions";

let mockChainId = 1;
let mockChains = [{ id: 1 }];

vi.mock("wagmi", () => {
  return {
    useAccount: () => ({
      address: "0xabc",
      connector: { name: "MockConnector" },
      isConnected: true,
      isConnecting: false,
      isReconnecting: false,
      status: "connected"
    }),
    useBalance: () => ({ data: { formatted: "1.0" }, isLoading: false }),
    useChainId: () => mockChainId,
    useChains: () => mockChains,
    useDisconnect: () => ({ disconnect: vi.fn() }),
    useSignMessage: () => ({ signMessageAsync: vi.fn(), isPending: false }),
    useSwitchChain: () => ({ switchChainAsync: vi.fn(), isPending: false }),
    useSendTransaction: () => ({ sendTransactionAsync: vi.fn(), isPending: false })
  };
});

describe("useWallet", () => {
  it("returns wallet state", () => {
    const { result } = renderHook(() => useWallet());
    expect(result.current.address).toBe("0xabc");
    expect(result.current.connectorName).toBe("MockConnector");
    expect(result.current.isUnsupported).toBe(false);
  });

  it("flags unsupported chain", () => {
    mockChainId = 10;
    mockChains = [{ id: 1 }];

    const { result } = renderHook(() => useWallet());
    expect(result.current.isUnsupported).toBe(true);
  });
});

describe("useWalletActions", () => {
  it("exposes wallet actions", () => {
    const { result } = renderHook(() => useWalletActions());
    expect(result.current.disconnect).toBeTypeOf("function");
    expect(result.current.signMessageAsync).toBeTypeOf("function");
    expect(result.current.switchChainAsync).toBeTypeOf("function");
    expect(result.current.sendTransactionAsync).toBeTypeOf("function");
  });
});

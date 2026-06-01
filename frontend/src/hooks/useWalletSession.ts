"use client";

import { useAccount, useChainId, useChains } from "wagmi";

export function useWalletSession() {
  const { address, connector, isConnected, isConnecting, isReconnecting, status } = useAccount();
  const chainId = useChainId();
  const chains = useChains();
  const isUnsupported = Boolean(isConnected && chains.length && !chains.find((c) => c.id === chainId));

  return {
    address,
    connectorName: connector?.name || "",
    isConnected,
    isConnecting,
    isReconnecting,
    status,
    chainId,
    chains,
    isUnsupported
  };
}

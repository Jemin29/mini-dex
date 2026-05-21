"use client";

import { useAccount, useBalance, useChainId, useChains } from "wagmi";

export function useWallet() {
  const { address, isConnected, isConnecting, isReconnecting, status } = useAccount();
  const chainId = useChainId();
  const chains = useChains();
  const isUnsupported = Boolean(isConnected && chains.length && !chains.find((c) => c.id === chainId));
  const balanceQuery = useBalance({ address, query: { enabled: Boolean(address) } });

  return {
    address,
    isConnected,
    isConnecting,
    isReconnecting,
    status,
    chainId,
    chains,
    isUnsupported,
    balanceQuery
  };
}

"use client";

import { useDisconnect, useSignMessage, useSwitchChain } from "wagmi";

export function useWalletActions() {
  const { disconnect } = useDisconnect();
  const { signMessageAsync, isPending: isSigning } = useSignMessage();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();

  return {
    disconnect,
    signMessageAsync,
    switchChainAsync,
    isSigning,
    isSwitching
  };
}

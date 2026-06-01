"use client";

import { useDisconnect, useSendTransaction, useSignMessage, useSwitchChain } from "wagmi";

export function useWalletActions() {
  const { disconnect } = useDisconnect();
  const { signMessageAsync, isPending: isSigning } = useSignMessage();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { sendTransactionAsync, isPending: isSending } = useSendTransaction();

  return {
    disconnect,
    signMessageAsync,
    sendTransactionAsync,
    switchChainAsync,
    isSigning,
    isSwitching,
    isSending
  };
}

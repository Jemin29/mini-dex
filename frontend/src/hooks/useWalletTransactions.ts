"use client";

import { useSendTransaction, useSignMessage } from "wagmi";

export function useWalletTransactions() {
  const { sendTransactionAsync, isPending: isSending } = useSendTransaction();
  const { signMessageAsync, isPending: isSigning } = useSignMessage();

  return {
    sendTransactionAsync,
    signMessageAsync,
    isSending,
    isSigning
  };
}

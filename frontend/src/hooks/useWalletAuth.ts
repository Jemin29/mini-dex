"use client";

import { useCallback, useState } from "react";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { signIn } from "next-auth/react";
import { SiweMessage } from "siwe";

type WalletAuthState = {
  isLoading: boolean;
  error: string | null;
};

export function useWalletAuth() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const [state, setState] = useState<WalletAuthState>({ isLoading: false, error: null });

  const signInWithWallet = useCallback(
    async (callbackUrl?: string) => {
      if (!isConnected || !address) {
        setState({ isLoading: false, error: "Connect a wallet to continue." });
        return;
      }

      try {
        setState({ isLoading: true, error: null });
        const nonceRes = await fetch("/api/auth/nonce", { method: "POST" });
        const { nonce } = (await nonceRes.json()) as { nonce: string };
        const message = new SiweMessage({
          domain: window.location.host,
          address,
          statement: "Sign in to Mini DEX.",
          uri: window.location.origin,
          version: "1",
          chainId,
          nonce
        });

        const signature = await signMessageAsync({ message: message.prepareMessage() });
        const result = await signIn("wallet", {
          message: JSON.stringify(message),
          signature,
          redirect: false,
          callbackUrl: callbackUrl || "/dashboard"
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        if (result?.url) {
          window.location.href = result.url;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Wallet sign-in failed.";
        setState({ isLoading: false, error: message });
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [address, chainId, isConnected, signMessageAsync]
  );

  return {
    signInWithWallet,
    isLoading: state.isLoading,
    error: state.error,
    isConnected,
    address
  };
}

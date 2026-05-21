"use client";

import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { dexContracts } from "@/lib/contracts";
import { normalizeError, isUserRejected } from "@/lib/errors";
import { approveToken, swapExactTokens } from "@/services/dexService";
import { useEthersSigner } from "@/hooks/useEthersSigner";

export function useDexActions() {
  const { address } = useAccount();
  const { signer, isReady } = useEthersSigner();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const swap = useCallback(
    async (
      tokenIn: string,
      tokenOut: string,
      amountIn: string,
      amountOutMin: string,
      decimalsIn: number,
      decimalsOut: number
    ) => {
      if (!signer || !address) return;

      try {
        setIsPending(true);
        setError(null);

        const allowanceTx = await approveToken(tokenIn, dexContracts.router.address, amountIn, decimalsIn, signer);
        await allowanceTx.wait();

        const deadline = Math.floor(Date.now() / 1000) + 60 * 5;
        const tx = await swapExactTokens(
          {
            router: dexContracts.router.address,
            tokenIn,
            tokenOut,
            amountIn,
            amountOutMin,
            to: address,
            deadline,
            decimalsIn,
            decimalsOut
          },
          signer
        );

        await tx.wait();
      } catch (err) {
        if (!isUserRejected(err)) {
          const normalized = normalizeError(err);
          setError(normalized.message);
        }
      } finally {
        setIsPending(false);
      }
    },
    [signer, address]
  );

  return {
    swap,
    isPending,
    error,
    isReady
  };
}

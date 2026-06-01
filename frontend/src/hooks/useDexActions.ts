"use client";

import { useCallback, useState } from "react";
import { Contract, parseUnits } from "ethers";
import { useAccount } from "wagmi";
import { dexContracts } from "@/lib/contracts";
import { normalizeError, isUserRejected } from "@/lib/errors";
import { approveToken, swapExactTokens } from "@/services/dexService";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { useTxStore } from "@/state/txStore";
import { Token } from "@/types/tokens";
import erc20Abi from "@/lib/abis/ERC20.json";

type SwapRequest = {
  tokenIn: Token;
  tokenOut: Token;
  amountIn: string;
  amountOutMin: string;
  amountOut: string;
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useDexActions() {
  const { address } = useAccount();
  const { signer, isReady } = useEthersSigner();
  const { push, update, addHistory, updateHistory } = useTxStore();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const swap = useCallback(
    async ({ tokenIn, tokenOut, amountIn, amountOutMin, amountOut }: SwapRequest) => {
      if (!signer || !address) return;

      let historyId: string | null = null;
      try {
        setIsPending(true);
        setError(null);

        historyId = createId();
        addHistory({
          id: historyId,
          type: "Swap",
          tokenIn: tokenIn.symbol,
          tokenOut: tokenOut.symbol,
          amountIn,
          amountOut,
          status: "pending",
          timestamp: new Date().toLocaleTimeString(),
          wallet: address,
          source: "local",
          createdAt: Date.now()
        });

        const erc20 = new Contract(tokenIn.address, erc20Abi, signer);
        const allowance = await erc20.allowance(address, dexContracts.router.address);
        const amountInParsed = parseUnits(amountIn, tokenIn.decimals);

        if (allowance < amountInParsed) {
          const approvalId = createId();
          push({
            id: approvalId,
            title: `Approve ${tokenIn.symbol}`,
            status: "pending",
            timestamp: new Date().toLocaleTimeString()
          });
          const allowanceTx = await approveToken(
            tokenIn.address,
            dexContracts.router.address,
            amountIn,
            tokenIn.decimals,
            signer
          );
          update(approvalId, { hash: allowanceTx.hash });
          const approvalReceipt = await allowanceTx.wait();
          update(approvalId, { status: approvalReceipt?.status === 1 ? "confirmed" : "failed" });
        }

        const deadline = Math.floor(Date.now() / 1000) + 60 * 5;
        const swapId = createId();
        push({
          id: swapId,
          title: "Swap submitted",
          status: "pending",
          timestamp: new Date().toLocaleTimeString()
        });

        const tx = await swapExactTokens(
          {
            router: dexContracts.router.address,
            tokenIn: tokenIn.address,
            tokenOut: tokenOut.address,
            amountIn: amountIn,
            amountOutMin: amountOutMin,
            to: address,
            deadline,
            decimalsIn: tokenIn.decimals,
            decimalsOut: tokenOut.decimals
          },
          signer
        );

        update(swapId, { hash: tx.hash });
        const receipt = await tx.wait();
        const status = receipt?.status === 1 ? "confirmed" : "failed";
        update(swapId, { status });
        updateHistory(historyId, status, tx.hash);
      } catch (err) {
        if (!isUserRejected(err)) {
          const normalized = normalizeError(err);
          setError(normalized.message);
        }
        if (historyId) {
          updateHistory(historyId, "failed");
        }
      } finally {
        setIsPending(false);
      }
    },
    [addHistory, address, push, signer, update, updateHistory]
  );

  return {
    swap,
    isPending,
    error,
    isReady
  };
}

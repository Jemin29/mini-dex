"use client";

import { useCallback, useState } from "react";
import { Contract, parseUnits } from "ethers";
import { useAccount } from "wagmi";
import { dexContracts } from "@/lib/contracts";
import { normalizeError, isUserRejected } from "@/lib/errors";
import { approveToken, addLiquidity, removeLiquidity } from "@/services/dexService";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { useTxStore } from "@/state/txStore";
import type { Token } from "@/types/tokens";
import erc20Abi from "@/lib/abis/ERC20.json";

type AddLiquidityRequest = {
  tokenA: Token;
  tokenB: Token;
  amountA: string;
  amountB: string;
  minA: string;
  minB: string;
};

type RemoveLiquidityRequest = {
  tokenA: Token;
  tokenB: Token;
  lpToken: string;
  lpAmount: string;
  minA: string;
  minB: string;
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useLiquidityActions() {
  const { address } = useAccount();
  const { signer, isReady } = useEthersSigner();
  const { push, update, addHistory, updateHistory } = useTxStore();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const add = useCallback(
    async ({ tokenA, tokenB, amountA, amountB, minA, minB }: AddLiquidityRequest) => {
      if (!signer || !address) return;

      let historyId: string | null = null;
      try {
        setIsPending(true);
        setError(null);

        historyId = createId();
        addHistory({
          id: historyId,
          type: "Add",
          tokenIn: tokenA.symbol,
          tokenOut: tokenB.symbol,
          amountIn: amountA,
          amountOut: amountB,
          status: "pending",
          timestamp: new Date().toLocaleTimeString(),
          wallet: address,
          source: "local",
          createdAt: Date.now()
        });

        const tokenAContract = new Contract(tokenA.address, erc20Abi, signer);
        const tokenBContract = new Contract(tokenB.address, erc20Abi, signer);
        const amountAParsed = parseUnits(amountA, tokenA.decimals);
        const amountBParsed = parseUnits(amountB, tokenB.decimals);

        const allowanceA = await tokenAContract.allowance(address, dexContracts.router.address);
        if (allowanceA < amountAParsed) {
          const approvalId = createId();
          push({ id: approvalId, title: `Approve ${tokenA.symbol}`, status: "pending", timestamp: new Date().toLocaleTimeString() });
          const tx = await approveToken(tokenA.address, dexContracts.router.address, amountA, tokenA.decimals, signer);
          update(approvalId, { hash: tx.hash });
          const receipt = await tx.wait();
          update(approvalId, { status: receipt?.status === 1 ? "confirmed" : "failed" });
        }

        const allowanceB = await tokenBContract.allowance(address, dexContracts.router.address);
        if (allowanceB < amountBParsed) {
          const approvalId = createId();
          push({ id: approvalId, title: `Approve ${tokenB.symbol}`, status: "pending", timestamp: new Date().toLocaleTimeString() });
          const tx = await approveToken(tokenB.address, dexContracts.router.address, amountB, tokenB.decimals, signer);
          update(approvalId, { hash: tx.hash });
          const receipt = await tx.wait();
          update(approvalId, { status: receipt?.status === 1 ? "confirmed" : "failed" });
        }

        const addId = createId();
        push({ id: addId, title: "Add liquidity", status: "pending", timestamp: new Date().toLocaleTimeString() });

        const tx = await addLiquidity(
          {
            router: dexContracts.router.address,
            tokenA: tokenA.address,
            tokenB: tokenB.address,
            amountADesired: amountA,
            amountBDesired: amountB,
            amountAMin: minA,
            amountBMin: minB,
            to: address,
            deadline: Math.floor(Date.now() / 1000) + 60 * 5,
            decimalsA: tokenA.decimals,
            decimalsB: tokenB.decimals
          },
          signer
        );

        update(addId, { hash: tx.hash });
        const receipt = await tx.wait();
        const status = receipt?.status === 1 ? "confirmed" : "failed";
        update(addId, { status });
        if (historyId) updateHistory(historyId, status, tx.hash);
      } catch (err) {
        if (!isUserRejected(err)) {
          const normalized = normalizeError(err);
          setError(normalized.message);
        }
        if (historyId) updateHistory(historyId, "failed");
      } finally {
        setIsPending(false);
      }
    },
    [addHistory, address, push, signer, update, updateHistory]
  );

  const remove = useCallback(
    async ({ tokenA, tokenB, lpToken, lpAmount, minA, minB }: RemoveLiquidityRequest) => {
      if (!signer || !address) return;

      let historyId: string | null = null;
      try {
        setIsPending(true);
        setError(null);

        historyId = createId();
        addHistory({
          id: historyId,
          type: "Remove",
          tokenIn: tokenA.symbol,
          tokenOut: tokenB.symbol,
          amountIn: lpAmount,
          amountOut: "0",
          status: "pending",
          timestamp: new Date().toLocaleTimeString(),
          wallet: address,
          source: "local",
          createdAt: Date.now()
        });

        const lpContract = new Contract(lpToken, erc20Abi, signer);
        const lpParsed = parseUnits(lpAmount, 18);
        const allowance = await lpContract.allowance(address, dexContracts.router.address);

        if (allowance < lpParsed) {
          const approvalId = createId();
          push({ id: approvalId, title: "Approve LP tokens", status: "pending", timestamp: new Date().toLocaleTimeString() });
          const tx = await approveToken(lpToken, dexContracts.router.address, lpAmount, 18, signer);
          update(approvalId, { hash: tx.hash });
          const receipt = await tx.wait();
          update(approvalId, { status: receipt?.status === 1 ? "confirmed" : "failed" });
        }

        const removeId = createId();
        push({ id: removeId, title: "Remove liquidity", status: "pending", timestamp: new Date().toLocaleTimeString() });

        const tx = await removeLiquidity(
          {
            router: dexContracts.router.address,
            tokenA: tokenA.address,
            tokenB: tokenB.address,
            liquidity: lpAmount,
            amountAMin: minA,
            amountBMin: minB,
            to: address,
            deadline: Math.floor(Date.now() / 1000) + 60 * 5,
            decimalsA: tokenA.decimals,
            decimalsB: tokenB.decimals,
            lpDecimals: 18
          },
          signer
        );

        update(removeId, { hash: tx.hash });
        const receipt = await tx.wait();
        const status = receipt?.status === 1 ? "confirmed" : "failed";
        update(removeId, { status });
        if (historyId) updateHistory(historyId, status, tx.hash);
      } catch (err) {
        if (!isUserRejected(err)) {
          const normalized = normalizeError(err);
          setError(normalized.message);
        }
        if (historyId) updateHistory(historyId, "failed");
      } finally {
        setIsPending(false);
      }
    },
    [addHistory, address, push, signer, update, updateHistory]
  );

  return {
    add,
    remove,
    error,
    isPending,
    isReady
  };
}

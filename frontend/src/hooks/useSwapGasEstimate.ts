"use client";

import { useEffect, useState } from "react";
import { Contract, parseUnits } from "ethers";
import routerAbi from "@/lib/abis/DexRouter.json";
import { useSwapStore } from "@/state/swapStore";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { dexContracts } from "@/lib/contracts";

export function useSwapGasEstimate(amountOutMin: string, decimalsIn: number, decimalsOut: number) {
  const { tokenIn, tokenOut, amountIn } = useSwapStore();
  const { signer } = useEthersSigner();
  const [gasLimit, setGasLimit] = useState<string>("-");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function estimate() {
      if (!signer || !tokenIn || !tokenOut || !amountIn) return;

      try {
        setIsLoading(true);
        const router = new Contract(dexContracts.router.address, routerAbi, signer);
        const amountInParsed = parseUnits(amountIn, decimalsIn);
        const minParsed = parseUnits(amountOutMin, decimalsOut);
        const estimated = await router.estimateGas.swapExactTokensForTokens(
          tokenIn.address,
          tokenOut.address,
          amountInParsed,
          minParsed,
          await signer.getAddress(),
          Math.floor(Date.now() / 1000) + 60 * 5
        );

        if (mounted) {
          setGasLimit(estimated.toString());
        }
      } catch {
        if (mounted) {
          setGasLimit("-");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    estimate();
    return () => {
      mounted = false;
    };
  }, [amountIn, amountOutMin, decimalsIn, decimalsOut, signer, tokenIn, tokenOut]);

  return { gasLimit, isLoading };
}

"use client";

import { useMemo } from "react";
import { formatUnits } from "viem";
import { useLiquidityStore } from "@/state/liquidityStore";
import { useLiquidityPoolData } from "@/hooks/useLiquidityPoolData";

const DAILY_VOLUME_RATIO = 0.25;

export function useLiquidityMetrics(lpTotalSupply?: number) {
  const { amountA, amountB, lpAmount, slippage, tokenA, tokenB } = useLiquidityStore();
  const pool = useLiquidityPoolData();

  return useMemo(() => {
    if (!tokenA || !tokenB || !pool.reserves || !pool.token0 || !pool.token1) {
      return {
        ratio: 0,
        reserveA: 0,
        reserveB: 0,
        optimalAmountA: 0,
        optimalAmountB: 0,
        minAmountA: 0,
        minAmountB: 0,
        expectedLiquidity: 0,
        removeAmountA: 0,
        removeAmountB: 0,
        feeApr: 0,
        poolMatches: false
      };
    }

    const token0 = pool.token0.toLowerCase();
    const token1 = pool.token1.toLowerCase();
    const tokenAIs0 = tokenA.address.toLowerCase() === token0 && tokenB.address.toLowerCase() === token1;
    const tokenAIs1 = tokenA.address.toLowerCase() === token1 && tokenB.address.toLowerCase() === token0;
    const poolMatches = tokenAIs0 || tokenAIs1;

    if (!poolMatches) {
      return {
        ratio: 0,
        reserveA: 0,
        reserveB: 0,
        optimalAmountA: 0,
        optimalAmountB: 0,
        minAmountA: 0,
        minAmountB: 0,
        expectedLiquidity: 0,
        removeAmountA: 0,
        removeAmountB: 0,
        feeApr: 0,
        poolMatches: false
      };
    }

    const [reserve0, reserve1] = pool.reserves;
    const reserveA = tokenAIs0
      ? Number(formatUnits(reserve0, tokenA.decimals))
      : Number(formatUnits(reserve1, tokenA.decimals));
    const reserveB = tokenAIs0
      ? Number(formatUnits(reserve1, tokenB.decimals))
      : Number(formatUnits(reserve0, tokenB.decimals));

    const amountAValue = Number(amountA) || 0;
    const amountBValue = Number(amountB) || 0;
    const lpValue = Number(lpAmount) || 0;

    const ratio = reserveA > 0 ? reserveB / reserveA : 0;
    const optimalAmountB = amountAValue > 0 && ratio > 0 ? amountAValue * ratio : 0;
    const optimalAmountA = amountBValue > 0 && ratio > 0 ? amountBValue / ratio : 0;

    const minAmountA = amountAValue > 0 ? amountAValue * (1 - slippage / 100) : 0;
    const minAmountB = amountBValue > 0 ? amountBValue * (1 - slippage / 100) : 0;

    let expectedLiquidity = 0;
    if (lpTotalSupply && lpTotalSupply > 0 && reserveA > 0 && reserveB > 0) {
      const liquidityA = (amountAValue * lpTotalSupply) / reserveA;
      const liquidityB = (amountBValue * lpTotalSupply) / reserveB;
      expectedLiquidity = Math.min(liquidityA, liquidityB);
    } else if (amountAValue > 0 && amountBValue > 0) {
      expectedLiquidity = Math.sqrt(amountAValue * amountBValue);
    }

    const removeAmountA = lpTotalSupply && lpTotalSupply > 0
      ? (lpValue * reserveA) / lpTotalSupply
      : 0;
    const removeAmountB = lpTotalSupply && lpTotalSupply > 0
      ? (lpValue * reserveB) / lpTotalSupply
      : 0;

    const feeBps = pool.feeBps ?? 30;
    const feeApr = DAILY_VOLUME_RATIO * 365 * (feeBps / 10_000) * 100;

    return {
      ratio,
      reserveA,
      reserveB,
      optimalAmountA,
      optimalAmountB,
      minAmountA,
      minAmountB,
      expectedLiquidity,
      removeAmountA,
      removeAmountB,
      feeApr,
      poolMatches: true
    };
  }, [amountA, amountB, lpAmount, lpTotalSupply, pool.feeBps, pool.reserves, pool.token0, pool.token1, slippage, tokenA, tokenB]);
}

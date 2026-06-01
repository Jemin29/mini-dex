import { create } from "zustand";
import type { Token } from "@/types/tokens";
import { DEFAULT_SLIPPAGE } from "@/lib/constants";

type LiquidityState = {
  tokenA?: Token;
  tokenB?: Token;
  amountA: string;
  amountB: string;
  lpAmount: string;
  slippage: number;
  setTokenA: (token: Token) => void;
  setTokenB: (token: Token) => void;
  setAmountA: (value: string) => void;
  setAmountB: (value: string) => void;
  setLpAmount: (value: string) => void;
  setSlippage: (value: number) => void;
  swapTokens: () => void;
};

export const useLiquidityStore = create<LiquidityState>((set, get) => ({
  tokenA: undefined,
  tokenB: undefined,
  amountA: "",
  amountB: "",
  lpAmount: "",
  slippage: DEFAULT_SLIPPAGE,
  setTokenA: (token) => set({ tokenA: token }),
  setTokenB: (token) => set({ tokenB: token }),
  setAmountA: (value) => set({ amountA: value }),
  setAmountB: (value) => set({ amountB: value }),
  setLpAmount: (value) => set({ lpAmount: value }),
  setSlippage: (value) => set({ slippage: value }),
  swapTokens: () => {
    const { tokenA, tokenB } = get();
    set({ tokenA: tokenB, tokenB: tokenA });
  }
}));

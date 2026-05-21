import { create } from "zustand";
import type { Token } from "@/types/tokens";
import { DEFAULT_SLIPPAGE } from "@/lib/constants";

export type SwapState = {
  tokenIn?: Token;
  tokenOut?: Token;
  amountIn: string;
  slippage: number;
  setTokenIn: (token: Token) => void;
  setTokenOut: (token: Token) => void;
  setAmountIn: (value: string) => void;
  setSlippage: (value: number) => void;
  swapTokens: () => void;
};

export const useSwapStore = create<SwapState>((set, get) => ({
  tokenIn: undefined,
  tokenOut: undefined,
  amountIn: "",
  slippage: DEFAULT_SLIPPAGE,
  setTokenIn: (token) => set({ tokenIn: token }),
  setTokenOut: (token) => set({ tokenOut: token }),
  setAmountIn: (value) => set({ amountIn: value }),
  setSlippage: (value) => set({ slippage: value }),
  swapTokens: () => {
    const { tokenIn, tokenOut } = get();
    set({ tokenIn: tokenOut, tokenOut: tokenIn });
  }
}));

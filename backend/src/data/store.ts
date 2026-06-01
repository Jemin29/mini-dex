import type { PoolData, TokenMetadata, Transaction } from "@/types";

export const tokens: TokenMetadata[] = [
  { symbol: "ETH", name: "Ether", address: "0x0", decimals: 18 },
  { symbol: "USDC", name: "USD Coin", address: "0x0", decimals: 6 },
  { symbol: "ARB", name: "Arbitrum", address: "0x0", decimals: 18 }
];

export const pools: PoolData[] = [
  { pair: "ETH / USDC", tvl: 18.2, volume24h: 0.92, feeApr: 12.4, liquidity: 120 },
  { pair: "WBTC / ETH", tvl: 9.6, volume24h: 0.42, feeApr: 8.6, liquidity: 80 }
];

export const transactions: Transaction[] = [];

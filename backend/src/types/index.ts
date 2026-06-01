export type TxStatus = "pending" | "confirmed" | "failed";
export type TxType = "Swap" | "Add" | "Remove";

export type Transaction = {
  id: string;
  hash: string;
  type: TxType;
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
  amountOut: number;
  wallet: string;
  status: TxStatus;
  timestamp: number;
};

export type TokenMetadata = {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoUrl?: string;
};

export type PoolData = {
  pair: string;
  tvl: number;
  volume24h: number;
  feeApr: number;
  liquidity: number;
};

export type AnalyticsSummary = {
  tvl: number;
  volume24h: number;
  activePools: number;
  swapCount24h: number;
};

export type UserActivity = {
  wallet: string;
  transactions: Transaction[];
};

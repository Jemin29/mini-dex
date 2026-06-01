export type TimeSeriesPoint = {
  time: string;
  value: number;
};

export type AnalyticsSummary = {
  tvl: number;
  volume24h: number;
  activePools: number;
  swapCount24h: number;
};

export type TopToken = {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  liquidity: number;
};

export type PoolPerformance = {
  pair: string;
  tvl: number;
  volume24h: number;
  feeApr: number;
  performance7d: number;
};

export type LiquiditySlice = {
  name: string;
  value: number;
};

export type RecentTransaction = {
  hash: string;
  type: "Swap" | "Add" | "Remove";
  pair: string;
  value: number;
  time: string;
};

export type PortfolioOverview = {
  netValue: number;
  pnl24h: number;
  positions: number;
};

export type WalletAnalytics = {
  activeWallets: number;
  newWallets: number;
  retention: number;
};

export type AnalyticsResponse = {
  summary: AnalyticsSummary;
  tvlSeries: TimeSeriesPoint[];
  volumeSeries: TimeSeriesPoint[];
  priceSeries: TimeSeriesPoint[];
  topTokens: TopToken[];
  pools: PoolPerformance[];
  liquidityDistribution: LiquiditySlice[];
  recentTxs: RecentTransaction[];
  portfolio: PortfolioOverview;
  wallet: WalletAnalytics;
  updatedAt: string;
};

export type TxStatus = "pending" | "confirmed" | "failed";
export type TxType = "Swap" | "Add" | "Remove";

export type TxNotification = {
  id: string;
  title: string;
  hash?: string;
  status: TxStatus;
  timestamp: string;
};

export type SwapHistoryItem = {
  id: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  status: TxStatus;
  timestamp: string;
  hash?: string;
};

export type TransactionHistoryItem = {
  id: string;
  type: TxType;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  status: TxStatus;
  timestamp: string;
  hash?: string;
  wallet?: string;
  source?: "local" | "onchain" | "api";
  createdAt?: number;
};

export type HistoryResponse = {
  items: TransactionHistoryItem[];
  page: number;
  pageSize: number;
  total: number;
  updatedAt: string;
};

export type TxStatus = "pending" | "confirmed" | "failed";

export type TxNotification = {
  id: string;
  title: string;
  hash?: string;
  status: TxStatus;
  timestamp: string;
};

import type { HistoryResponse, TxStatus, TxType } from "@/types/tx";

type FetchHistoryParams = {
  page: number;
  pageSize: number;
  type?: TxType | "All";
  status?: TxStatus | "All";
  search?: string;
  wallet?: string;
};

export async function fetchHistory(params: FetchHistoryParams): Promise<HistoryResponse> {
  const url = new URL("/api/history", window.location.origin);
  url.searchParams.set("page", String(params.page));
  url.searchParams.set("pageSize", String(params.pageSize));

  if (params.type && params.type !== "All") url.searchParams.set("type", params.type);
  if (params.status && params.status !== "All") url.searchParams.set("status", params.status);
  if (params.search) url.searchParams.set("search", params.search);
  if (params.wallet) url.searchParams.set("wallet", params.wallet);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load history");
  }

  return res.json();
}

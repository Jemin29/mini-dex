import { NextResponse } from "next/server";
import type { HistoryResponse, TransactionHistoryItem, TxStatus, TxType } from "@/types/tx";

const SAMPLE_HISTORY: TransactionHistoryItem[] = [
  {
    id: "api-1",
    type: "Swap",
    tokenIn: "ETH",
    tokenOut: "USDC",
    amountIn: "1.20",
    amountOut: "3850.12",
    status: "confirmed",
    timestamp: "2m ago",
    hash: "0x9c4d...1f2a",
    source: "api",
    createdAt: Date.now() - 2 * 60 * 1000
  },
  {
    id: "api-2",
    type: "Add",
    tokenIn: "ETH",
    tokenOut: "USDC",
    amountIn: "2.00",
    amountOut: "6400.00",
    status: "confirmed",
    timestamp: "9m ago",
    hash: "0x2a8b...91ce",
    source: "api",
    createdAt: Date.now() - 9 * 60 * 1000
  },
  {
    id: "api-3",
    type: "Remove",
    tokenIn: "WBTC",
    tokenOut: "ETH",
    amountIn: "0.75",
    amountOut: "12.2",
    status: "pending",
    timestamp: "18m ago",
    hash: "0xb41c...7a13",
    source: "api",
    createdAt: Date.now() - 18 * 60 * 1000
  }
];

function parseNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as TxType | null;
  const status = searchParams.get("status") as TxStatus | null;
  const search = (searchParams.get("search") || "").toLowerCase();
  const wallet = (searchParams.get("wallet") || "").toLowerCase();
  const page = parseNumber(searchParams.get("page"), 1);
  const pageSize = parseNumber(searchParams.get("pageSize"), 10);

  let items = [...SAMPLE_HISTORY];

  if (type && type !== ("All" as string)) {
    items = items.filter((item) => item.type === type);
  }

  if (status && status !== ("All" as string)) {
    items = items.filter((item) => item.status === status);
  }

  if (wallet) {
    items = items.filter((item) => item.wallet?.toLowerCase() === wallet);
  }

  if (search) {
    items = items.filter((item) =>
      [item.tokenIn, item.tokenOut, item.hash, item.type, item.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search))
    );
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  const response: HistoryResponse = {
    items: paged,
    page,
    pageSize,
    total,
    updatedAt: new Date().toISOString()
  };

  return NextResponse.json(response, { headers: { "Cache-Control": "no-store" } });
}

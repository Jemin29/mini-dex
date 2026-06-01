"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/format";
import { getExplorerTxUrl } from "@/lib/explorer";
import type { TransactionHistoryItem } from "@/types/tx";
import HistoryDetailsModal from "@/components/history/HistoryDetailsModal";

const statusClass = (status: string) => {
  if (status === "confirmed") return "text-emerald-400";
  if (status === "failed") return "text-red-400";
  return "text-amber-400";
};

export default function TransactionHistoryTable({ items }: { items: TransactionHistoryItem[] }) {
  const [selected, setSelected] = useState<TransactionHistoryItem | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted">No transactions yet.</p>
        ) : (
          <div className="grid gap-3">
            {items.map((tx) => {
              const explorerUrl = getExplorerTxUrl(tx.hash);
              return (
                <button
                  key={tx.id}
                  onClick={() => setSelected(tx)}
                  className="grid items-center gap-3 rounded-xl border border-border px-4 py-3 text-left text-xs transition hover:border-accent/50 hover:bg-white/5 md:grid-cols-[100px_1fr_120px_140px_140px]"
                >
                  <Badge className="w-fit">{tx.type}</Badge>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tx.tokenIn} / {tx.tokenOut}</p>
                    <p className="text-[11px] text-muted">{tx.timestamp}</p>
                  </div>
                  <p className="text-muted">
                    {formatNumber(Number(tx.amountIn), 6)} {tx.tokenIn}
                  </p>
                  <p className="text-muted">
                    {formatNumber(Number(tx.amountOut), 6)} {tx.tokenOut}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className={statusClass(tx.status)}>{tx.status}</span>
                    {explorerUrl && (
                      <a
                        className="text-[11px] text-accent hover:underline"
                        href={explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Explorer
                      </a>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
      <HistoryDetailsModal open={Boolean(selected)} onOpenChange={() => setSelected(null)} tx={selected} />
    </Card>
  );
}

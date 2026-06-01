"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTxStore } from "@/state/txStore";
import { formatNumber } from "@/lib/format";

export default function TxTable() {
  const { history } = useTxStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-muted">No swaps yet.</p>
        ) : (
          <div className="grid gap-3">
            {history.map((tx) => (
              <div
                key={tx.id}
                className="grid items-center gap-3 rounded-xl border border-border px-4 py-3 md:grid-cols-4"
              >
                <p className="text-sm font-semibold text-foreground">{tx.type}</p>
                <p className="text-xs text-muted">{tx.tokenIn} / {tx.tokenOut}</p>
                <Badge className="w-fit" aria-label={`Status ${tx.status}`}>{tx.status}</Badge>
                <p className="text-xs text-muted">
                  {formatNumber(Number(tx.amountIn), 6)} {tx.tokenIn} → {formatNumber(Number(tx.amountOut), 6)} {tx.tokenOut}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

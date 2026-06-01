"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { TransactionHistoryItem } from "@/types/tx";
import { getExplorerTxUrl } from "@/lib/explorer";

type HistoryDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tx?: TransactionHistoryItem | null;
};

export default function HistoryDetailsModal({ open, onOpenChange, tx }: HistoryDetailsModalProps) {
  if (!tx) return null;

  const explorerUrl = getExplorerTxUrl(tx.hash);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction details</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm text-muted">
          <div className="flex items-center justify-between">
            <span>Type</span>
            <span className="text-foreground">{tx.type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Pair</span>
            <span className="text-foreground">{tx.tokenIn} / {tx.tokenOut}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Amounts</span>
            <span className="text-foreground">{tx.amountIn} → {tx.amountOut}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Status</span>
            <span className="text-foreground">{tx.status}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Timestamp</span>
            <span className="text-foreground">{tx.timestamp}</span>
          </div>
          {tx.hash && (
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Transaction hash</p>
              <p className="break-all text-xs text-foreground">{tx.hash}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {explorerUrl && (
            <Button asChild className="w-full">
              <a href={explorerUrl} target="_blank" rel="noreferrer">
                View on explorer
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

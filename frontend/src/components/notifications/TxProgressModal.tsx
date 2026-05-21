"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";

const steps = [
  { label: "Awaiting signature", status: "pending" },
  { label: "Submitting transaction", status: "pending" },
  { label: "Confirming on-chain", status: "pending" }
];

type TxProgressModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function TxProgressModal({ open, onOpenChange }: TxProgressModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction progress</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted">
          {steps.map((step) => (
            <div key={step.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Spinner />
                <span>{step.label}</span>
              </div>
              <span className="text-xs text-amber-300">In progress</span>
            </div>
          ))}
          <Separator />
          <p className="text-xs text-muted">
            Keep this window open while your transaction is processing.
          </p>
        </div>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}

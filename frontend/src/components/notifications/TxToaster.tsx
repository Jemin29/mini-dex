"use client";

import { useTxStore } from "@/state/txStore";
import { cn } from "@/lib/utils";

export default function TxToaster() {
  const { notifications, dismiss } = useTxStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3" aria-live="polite" aria-atomic="true">
      {notifications.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "glass w-72 rounded-xl p-4 text-sm animate-fade-up",
            toast.status === "failed" && "border-red-500/40"
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">{toast.title}</p>
              <p className="text-xs text-muted">{toast.timestamp}</p>
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-xs text-muted hover:text-foreground"
            >
              Close
            </button>
          </div>
          {toast.hash && (
            <p className="mt-2 break-all text-xs text-muted">{toast.hash}</p>
          )}
        </div>
      ))}
    </div>
  );
}

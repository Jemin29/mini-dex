import { useCallback } from "react";
import { useTxStore } from "@/state/txStore";
import { TxNotification } from "@/types/tx";

export function useTxNotifications() {
  const { push, dismiss } = useTxStore();

  const notify = useCallback((notification: TxNotification) => {
    push(notification);
  }, [push]);

  return { notify, dismiss };
}

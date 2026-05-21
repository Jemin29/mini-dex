import { create } from "zustand";
import { TxNotification } from "@/types/tx";

type TxStore = {
  notifications: TxNotification[];
  push: (notification: TxNotification) => void;
  dismiss: (id: string) => void;
};

export const useTxStore = create<TxStore>((set) => ({
  notifications: [],
  push: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications].slice(0, 5) })),
  dismiss: (id) => set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) }))
}));

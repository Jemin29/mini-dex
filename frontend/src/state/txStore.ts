import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TransactionHistoryItem, TxNotification, TxStatus } from "@/types/tx";

type TxStore = {
  notifications: TxNotification[];
  history: TransactionHistoryItem[];
  cachedHistory: TransactionHistoryItem[];
  lastSync?: string;
  push: (notification: TxNotification) => void;
  dismiss: (id: string) => void;
  update: (id: string, updates: Partial<TxNotification>) => void;
  addHistory: (item: TransactionHistoryItem) => void;
  updateHistory: (id: string, status: TxStatus, hash?: string) => void;
  setCachedHistory: (items: TransactionHistoryItem[], timestamp: string) => void;
};

export const useTxStore = create<TxStore>()(
  persist(
    (set) => ({
      notifications: [],
      history: [],
      cachedHistory: [],
      push: (notification) =>
        set((state) => ({ notifications: [notification, ...state.notifications].slice(0, 5) })),
      dismiss: (id) => set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),
      update: (id, updates) =>
        set((state) => ({
          notifications: state.notifications.map((note) =>
            note.id === id ? { ...note, ...updates } : note
          )
        })),
      addHistory: (item) =>
        set((state) => ({ history: [item, ...state.history].slice(0, 50) })),
      updateHistory: (id, status, hash) =>
        set((state) => ({
          history: state.history.map((entry) =>
            entry.id === id ? { ...entry, status, hash: hash ?? entry.hash } : entry
          )
        })),
      setCachedHistory: (items, timestamp) =>
        set(() => ({ cachedHistory: items, lastSync: timestamp }))
    }),
    {
      name: "dex-tx-store",
      partialize: (state) => ({ history: state.history, cachedHistory: state.cachedHistory, lastSync: state.lastSync })
    }
  )
);

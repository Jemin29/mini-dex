import { create } from "zustand";

type UiStore = {
  tokenModalOpen: boolean;
  setTokenModalOpen: (open: boolean) => void;
};

export const useUiStore = create<UiStore>((set) => ({
  tokenModalOpen: false,
  setTokenModalOpen: (open) => set({ tokenModalOpen: open })
}));

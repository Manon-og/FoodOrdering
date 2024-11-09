import { create } from "zustand";

interface CashCountState {
  cash: number | null;
  setCash: (cash: number) => void;
}

export const useCashStore = create<CashCountState>((set) => ({
  cash: null,
  setCash: (cash) => set({ cash }),
}));

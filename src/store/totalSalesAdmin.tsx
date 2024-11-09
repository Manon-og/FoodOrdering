import { create } from "zustand";

interface SalesState {
  sales: number | null;
  setSales: (sales: number) => void;
}

export const useSalesStore = create<SalesState>((set) => ({
  sales: null,
  setSales: (sales) => set({ sales }),
}));

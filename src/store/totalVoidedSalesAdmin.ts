import { create } from "zustand";

interface VoidedSalesState {
  voidSales: number | null;
  setVoid: (voidsales: number) => void;
}

export const useVoidedSalesStore = create<VoidedSalesState>((set) => ({
  voidSales: null,
  setVoid: (voidSales) => set({ voidSales }),
}));

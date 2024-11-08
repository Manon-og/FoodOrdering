import { create } from "zustand";

interface QuantityState {
  quantity: number | null;
  setQuantity: (quantity: number) => void;
}

export const useQuantitytore = create<QuantityState>((set) => ({
  quantity: null,
  setQuantity: (quantity) => set({ quantity }),
}));

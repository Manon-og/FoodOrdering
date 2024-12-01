import { create } from "zustand";

interface MenuQuantityState {
  quantity: any | null;
  setMenuQuantity: (quantity: any) => void;
}

export const useMenuQuantityStore = create<MenuQuantityState>((set) => ({
  quantity: null,
  setMenuQuantity: (quantity) => set({ quantity }),
}));

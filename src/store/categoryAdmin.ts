import { create } from "zustand";

interface CategoryState {
  category: string | null;
  setCategory: (category: string) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  category: null,
  setCategory: (category) => set({ category }),
}));

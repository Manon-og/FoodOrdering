import { create } from "zustand";

interface DateState {
  Ddate: string | null;
  setDate: (DdateDate: string) => void;
}

export const useDateStore = create<DateState>((set) => ({
  Ddate: null,
  setDate: (Ddate) => set({ Ddate }),
}));

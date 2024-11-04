import { create } from "zustand";

interface NameState {
  id: string | null;
  setId: (id: string) => void;
}

export const useUUIDStore = create<NameState>((set) => ({
  id: null,
  setId: (id) => set({ id }),
}));

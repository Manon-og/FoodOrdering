import { create } from "zustand";

interface idGroupState {
  idGroup: string | null;
  setIdGroup: (idGroup: string) => void;
}

export const useIdGroupStore = create<idGroupState>((set) => ({
  idGroup: null,
  setIdGroup: (idGroup) => set({ idGroup }),
}));

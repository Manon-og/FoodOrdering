import { create } from "zustand";

interface logOutState {
  status: string | null;
  setStatus: (status: string) => void;
}

export const useLogoutStore = create<logOutState>((set) => ({
  status: null,
  setStatus: (status) => set({ status }),
}));

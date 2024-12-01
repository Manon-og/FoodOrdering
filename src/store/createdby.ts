import { create } from "zustand";

interface CreatedbyState {
  created_by: string | null;
  setCreated_by: (created_by: string) => void;
}

export const CreatedByStore = create<CreatedbyState>((set) => ({
  created_by: null,
  setCreated_by: (created_by) => set({ created_by }),
}));

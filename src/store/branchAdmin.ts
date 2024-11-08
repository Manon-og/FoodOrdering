import { create } from "zustand";

interface BranchState {
  id_branch: string | string[];
  branchName: string;
  setBranchDataAdmin: (
    id_branch: string | string[],
    branchName: string
  ) => void;
}

export const useBranchStoreAdmin = create<BranchState>((set) => ({
  id_branch: [],
  branchName: "",
  setBranchDataAdmin: (id_branch, branchName) => set({ id_branch, branchName }),
}));

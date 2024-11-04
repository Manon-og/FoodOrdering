import { create } from "zustand";

interface BranchState {
  id_branch: string | null;
  branchName: string;
  setBranchData: (id_branch: string | null, branchName: string) => void;
}

export const useBranchStore = create<BranchState>((set) => ({
  id_branch: null,
  branchName: "",
  setBranchData: (id_branch, branchName) => set({ id_branch, branchName }),
}));

import { useLocalSearchParams } from 'expo-router';

export const useBranchName = () => {
  const { branchName, id_branch } = useLocalSearchParams<{ branchName?: string; id_branch?: string }>();
  return {
    branchName: branchName ? branchName.toString() : '',
    id_branch: id_branch ? id_branch.toString() : '',
  };
};
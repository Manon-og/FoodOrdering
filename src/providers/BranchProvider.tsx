import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BranchContextProps {
  branchName: string;
  id_branch: string;
  setBranchName: (name: string) => void;
  setIdBranch: (id: string) => void;
}

const BranchContext = createContext<BranchContextProps | undefined>(undefined);

export const useByBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};

interface BranchProviderProps {
  children: ReactNode;
}

export const BranchProvider = ({ children }: BranchProviderProps) => {
  const [branchName, setBranchName] = useState('');
  const [id_branch, setIdBranch] = useState('');

  const value = {
    branchName,
    id_branch,
    setBranchName,
    setIdBranch,
  };

  console.log('WHEREEE:', id_branch,branchName );

  return (
    <BranchContext.Provider value={value}>
      {children}
    </BranchContext.Provider>
  );
};
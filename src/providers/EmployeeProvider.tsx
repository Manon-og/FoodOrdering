import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchEmployees } from "@/api/products"; // Ensure the correct import path

type EmployeeContextType = {
  employees: Employee[];
  refreshEmployees: () => Promise<void>;
};

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

import { ReactNode } from "react";

type Employee = {
  id: any;
  full_name: any;
  email: any;
  id_roles: number;
  birth_date: any;
  id_archives: number;
};

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const loadEmployees = async () => {
    const data = await fetchEmployees();
    const formattedData = data.map((employee: any) => ({
      ...employee,
      id_roles: employee.id_roles || 0, // Provide a default value if id_roles is missing
    }));
    setEmployees(formattedData);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <EmployeeContext.Provider
      value={{ employees, refreshEmployees: loadEmployees }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error(
      "useEmployeeContext must be used within an EmployeeProvider"
    );
  }
  return context;
};

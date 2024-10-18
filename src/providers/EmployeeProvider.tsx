import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase"; // Ensure you have the correct import for supabase
import { fetchEmployees } from "@/api/products"; // Ensure the correct import path

// Define the Employee type
interface Employee {
  id: string;
  full_name: string;
  group?: string;
  email?: string; // Optional if not always present
}

interface EmployeeContextType {
  employees: Employee[];
  refreshEmployees: () => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const loadEmployees = async () => {
    try {
      const data = await fetchEmployees();
      setEmployees(data as Employee[]);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
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

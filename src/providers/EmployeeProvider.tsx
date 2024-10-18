import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase"; // Ensure you have the correct import for supabase

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

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, group");
    if (error) {
      console.error("Error fetching employees:", error);
    } else {
      setEmployees(data as Employee[]); // Type assertion
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <EmployeeContext.Provider
      value={{ employees, refreshEmployees: fetchEmployees }}
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

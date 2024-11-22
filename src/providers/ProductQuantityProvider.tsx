import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchEmployees, useProductsQuantity } from "@/api/products"; // Ensure the correct import path

type EmployeeContextType = {
  products: Products[];
  refreshEmployees: () => Promise<void>;
};

const ProductQuantity = createContext<EmployeeContextType | undefined>(
  undefined
);

import { ReactNode } from "react";

type Products = {
  id_products: any;
  quantity: any;
};

export const ProductQuantityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [products, setEmployees] = useState<Products[]>([]);

  const loadEmployees = async () => {
    const { data } = await useProductsQuantity();
    const formattedData: any = data?.map((product: any) => ({
      ...product,
      quantity: product.quantity || 0, // Provide a default value if quantity is missing
    }));
    setEmployees(formattedData);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <ProductQuantity.Provider
      value={{ products, refreshEmployees: loadEmployees }}
    >
      {children}
    </ProductQuantity.Provider>
  );
};

export const useEmployeeContext = () => {
  const context = useContext(ProductQuantity);
  if (!context) {
    throw new Error(
      "useEmployeeContext must be used within an EmployeeProvider"
    );
  }
  console.log("CONTEXT PRODUCTSQUANTITY:", context);
  return context;
};

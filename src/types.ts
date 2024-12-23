export type Product = {
  id_price: any;
  id: number;
  image: string | null;
  name: string;
  price: number;
};

export type PizzaSize = "S" | "M" | "L" | "XL";

export type CartItem = {
  name: any;
  price: any;
  name: ReactNode;
  id_localbranch: number;
  id_products: any;
  id: string;
  product: Product;
  product_id: number;
  quantity: number;
};

export const OrderStatusList: OrderStatus[] = [
  "New",
  "Cooking",
  "Delivering",
  "Delivered",
];

export type OrderStatus = "New" | "Cooking" | "Delivering" | "Delivered";

export type Order = {
  id: number;
  created_at: string;
  total: number;
  user_id: string;
  status: OrderStatus;

  order_items?: OrderItem[];
};

export type OrderItem = {
  id: number;
  product_id: number;
  products: Product;
  order_id: number;
  size: PizzaSize;
  quantity: number;
};

export type Profile = {
  id: string;
  group: string;
};

export type Branch = {
  id: number;
  place: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  id_archives: number;
};

// export interface Product {
//   id: string;
//   name: string;
//   description?: string;
//   price: number;
//   image?: string;
//   category?: string;
//   stock: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

import { Product } from "@prisma/client";

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface CartState {
  items: CartItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  promoCode?: string;
  discount: number;
  deliveryFee: number;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  discountPercentage: number;
  quantity: number;
  stock: number;
  category: string;
  image?: string;
}

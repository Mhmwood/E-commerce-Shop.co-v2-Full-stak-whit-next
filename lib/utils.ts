import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

export const formatCurrency = (number: number) => {
  return CURRENCY_FORMATTER.format(number);
};

export const BASE_URL =
  typeof window !== "undefined"
    ? "" // client-side relative URL
    : process.env.NEXTAUTH_URL ||
      "https://e-commerce-shop-co-v2-full-stak-whi.vercel.app";


export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/api/categories`, {
    cache:"reload"
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};
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

// export async function getCategories() {
//   const res = await fetch("/api/categories", {
//     cache: "reload",
//   });
//   if (!res.ok) throw new Error("Failed to fetch categories");
//   return res.json();
// }

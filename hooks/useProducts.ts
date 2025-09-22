"use client";

import { useQuery } from "@tanstack/react-query";

interface UseProductsParams {
  category?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  minPrice?: string;
  maxPrice?: string;
  select?: Record<string, boolean>;
}

export const useProducts = (params: UseProductsParams) =>
  useQuery({
    queryKey: ["products", JSON.stringify(params)],
    queryFn: async () => {
      const query = new URLSearchParams({
        ...(params.category && { category: params.category }),
        ...(params.limit != null && { limit: String(params.limit) }),
        ...(params.page != null && { page: String(params.page) }),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.minPrice && { minPrice: params.minPrice }),
        ...(params.maxPrice && { maxPrice: params.maxPrice }),
        ...(params.order && { sortOrder: params.order }),
      });

      const select = params.select
        ? `select=${Object.keys(params.select).join(",")}`
        : "";

      const res = await fetch(
        `/api/products?${query}&${select}`
      );

      if (!res.ok) throw new Error("Failed to fetch products");

      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

export const useProductById = (
  id: string,
  selectParam?: Record<string, boolean>
) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const select = selectParam
        ? `select=${Object.keys(selectParam).join(",")}`
        : "";

      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products/${id}?${select}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
export const useSearchProducts = (query: string, limit = 7) => {
  return useQuery({
    queryKey: ["search-products", query],
    queryFn: async () => {
      if (!query) return [];
      const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/products?query=${encodeURIComponent(
          query
        )}&limit=${limit}&select=id,title,price,category,thumbnail,discountPercentage,stock`
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    enabled: !!query,
  });
};

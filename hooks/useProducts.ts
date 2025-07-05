"use client";

import { useQuery } from "@tanstack/react-query";

// interface UseProductsParams {
//   category?: string;
//   limit?: number;
//   skip?: number;
//   sortBy?: string;
//   order?: "asc" | "desc";
//   minprice?: string;
//   maxprice?: string;
//   select?: Record<string, boolean>;
// }

// export const useProducts = (params: UseProductsParams) => {
//   return useQuery({
//     queryKey: ["products", params],
//     queryFn: async () => {
//       const query = new URLSearchParams({
//         ...(params.category && { category: params.category }),
//         ...(params.limit !== undefined && { limit: String(params.limit) }),
//         ...(params.skip !== undefined && { skip: String(params.skip) }),
//         ...(params.sortBy && { sortBy: params.sortBy }),
//         ...(params.maxprice && { maxprice: params.maxprice }),
//         ...(params.minprice && { minprice: params.minprice }),
//         ...(params.order && { order: params.order }),
//         ...(params.select && {
//           select: JSON.stringify(params.select),
//         }),
//       });

//       const res = await fetch(`/api/products?${query.toString()}`);

//       if (!res.ok) throw new Error("Failed to fetch products");

//       return res.json();
//     },
//     staleTime: 1000 * 60 * 5,
//     // keepPreviousData: true,
//   });
// };
// hooks/useProducts.ts

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
    queryKey: ["products", params],
    queryFn: async () => {
      const query = new URLSearchParams({
        ...(params.category && { category: params.category }),
        ...(params.limit != null && { limit: String(params.limit) }),
        ...(params.page != null && { page: String(params.page) }),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.minPrice && { minPrice: params.minPrice }),
        ...(params.maxPrice && { maxPrice: params.maxPrice }),
        ...(params.order && { sortOrder: params.order }),
        ...(params.select && { select: JSON.stringify(params.select) }),
      });

      const res = await fetch(`/api/products?${query}`);

      if (!res.ok) throw new Error("Failed to fetch products");

      return res.json();
    },
    // staleTime: 1000 * 60 * 5,
  });

export const useProductById = (
  id: string,
  select?: Record<string, boolean>
) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const query = new URLSearchParams({
        ...(select && { select: JSON.stringify(select) }),
      });

      const res = await fetch(`/api/products/${id}?${query}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchProducts = (query: string, limit = 7) => {
  return useQuery({
    queryKey: ["search-products", query, limit],
    queryFn: async () => {
      if (!query) return [];
      const res = await fetch(
        `/api/products?query=${encodeURIComponent(query)}&limit=${limit}`
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    enabled: !!query,
  });
};

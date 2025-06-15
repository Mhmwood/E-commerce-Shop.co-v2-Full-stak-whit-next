import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  image: z.string().url().optional().or(z.literal("")),
  category: z.string().optional(),
  stock: z.number().int().min(0, "Stock must be non-negative"),
});

export type ProductFormData = z.infer<typeof productSchema>;

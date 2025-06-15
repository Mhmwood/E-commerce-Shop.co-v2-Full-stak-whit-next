import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  discountPercentage: z.number().min(0).max(100),
  rating: z.number().min(0).max(5),
  stock: z.number().int().nonnegative(),
  tags: z.array(z.string()),
  brand: z.string(),
  sku: z.string(),
  weight: z.number().positive(),
  warrantyInformation: z.string(),
  shippingInformation: z.string(),
  availabilityStatus: z.string(),
  returnPolicy: z.string(),
  minimumOrderQuantity: z.number().int().min(1),
  thumbnail: z.string().url(),
  images: z.array(z.string().url()),
  categoryId: z.number().int(),
});

import { z } from "zod";

// Helper schemas
const nonEmptyString = z.string().trim().min(1, "Cannot be empty");
const positiveNumber = z.number().positive();
const stringAndOptional = z.string().trim().optional();
const numberAndOptional = z.number().positive().optional();

const BaseProductSchema = z.object({
  title: nonEmptyString
    .min(3, "Title must be at least 3 characters")
    .max(20, "Title cannot exceed 20 characters"),
  description: nonEmptyString.max(
    50,
    "Description cannot exceed 50 characters"
  ),
  price: positiveNumber,
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  thumbnail: z.string().url("Invalid thumbnail URL"),
  images: z.array(z.string().url("Invalid image URL")).max(3).optional(),
  category: nonEmptyString
    .max(20, "category cannot exceed 20 characters")
    .toLowerCase(),
  discountPercentage: numberAndOptional,
  brand: stringAndOptional,
  sku: stringAndOptional,
  warrantyInformation: stringAndOptional,
  shippingInformation: stringAndOptional,
  availabilityStatus: stringAndOptional,
  returnPolicy: stringAndOptional,

  weight: numberAndOptional,
  minimumOrderQuantity: numberAndOptional,


});

export const ProductSchema = BaseProductSchema.refine(
  (data) => {
    if (data.discountPercentage !== undefined) {
      return data.discountPercentage < data.price;
    }
    return true;
  },
  {
    message: "Discount must be less than price",
  }
);
export const UpdateProductSchema = BaseProductSchema.partial().refine(
  (data) => {
    if (data.discountPercentage && data.price) {
      return data.discountPercentage < data.price;
    }
    return true;
  },
  {
    message: "Discount must be less than price",
  }
);

// TypeScript type
export type ProductInput = z.infer<typeof ProductSchema>;

import { z } from "zod";

// Helper schemas
const nonEmptyString = z.string().trim().min(1, "Cannot be empty");

const BaseReviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .int("Rating must be a whole number"),

  comment: nonEmptyString
    .min(4, "Comment must be at least 10 characters")
    .max(200, "Comment cannot exceed 500 characters"),
  reviewerName: nonEmptyString.min(1, "Reviewer name cannot be empty"),

  productId: nonEmptyString.min(1, "Product ID cannot be empty"),
  userId: nonEmptyString.min(1, "User ID cannot be empty"),
});

// Schema for creating a new review
export const CreateReviewSchema = BaseReviewSchema.refine(
  (data) => {
    // Additional business logic validation
    if (data.rating < 1 || data.rating > 5) {
      return false;
    }
    return true;
  },
  {
    message: "Rating must be between 1 and 5",
    path: ["rating"],
  }
);

// Schema for updating an existing review
export const UpdateReviewSchema = BaseReviewSchema.partial().refine(
  (data) => {
    // If rating is provided in update, validate it
    if (data.rating !== undefined) {
      return data.rating >= 1 && data.rating <= 5;
    }
    return true;
  },
  {
    message: "Rating must be between 1 and 5",
    path: ["rating"],
  }
);

// TypeScript types
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
export type UpdateReviewInput = z.infer<typeof UpdateReviewSchema>;

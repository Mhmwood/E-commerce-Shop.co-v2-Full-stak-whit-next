import { NextResponse } from "next/server";
import { createApiError } from "../errHandle";

export const generateOrderBy = (
  sortBy: string | null,
  sortOrder: "asc" | "desc" = "asc"
) => {
  if (!sortBy) return undefined;

  const allowedFields = {
    price: "direct",
    rating: "direct",
    title: "direct",
    meta: "relation",
    "meta.createdAt": "nested",
    "meta.updatedAt": "nested",
  };

  try {
    return sortBy.split(",").map((field) => {
      const trimmedField = field.trim();

      if (trimmedField === "meta") {
        return { meta: { createdAt: sortOrder } };
      }

      const [fieldName, specificOrder] = trimmedField.split(":");
      const order = specificOrder?.trim() || sortOrder;

      if (!(fieldName in allowedFields)) {
        throw new Error(`Invalid sort field: ${fieldName}`);
      }

      if (allowedFields[fieldName as keyof typeof allowedFields] === "nested") {
        const [relation, nestedField] = fieldName.split(".");
        return { [relation]: { [nestedField]: order } };
      }
      return { [fieldName]: order };
    });
  } catch (err) {
    const error = createApiError(
      "You can only select from the following fields: price, rating,title, meta, meta.createdAt, meta.updatedAt",
      400,
      "BAD_REQUEST"
    );
    return NextResponse.json(error, {
      status: error.status,
    });
  }
};

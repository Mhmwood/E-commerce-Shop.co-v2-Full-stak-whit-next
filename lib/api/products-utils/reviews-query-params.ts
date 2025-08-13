import { NextRequest, NextResponse } from "next/server";
import { createApiError } from "../errHandle";

// export interface ReviewsQueryParams {
//   limit: number;
//   sortBy?: "rating" | "date" | "reviewerName";
//   sortOrder: "asc" | "desc";
//   productId?: string;
//   rating?: number;
// }

// export const parseReviewsQueryParams = (
//   request: NextRequest
// ): ReviewsQueryParams | NextResponse => {
//   const { searchParams } = new URL(request.url);

//   const limit = parseInt(searchParams.get("limit") || "10");
//   const sortBy = searchParams.get("sortBy") as
//     | "rating"
//     | "date"
//     | "reviewerName"
//     | null;
//   const productId = searchParams.get("productId") ?? undefined;
//   const rating = searchParams.get("rating")
//     ? parseInt(searchParams.get("rating")!)
//     : undefined;

//   if (isNaN(limit) || (rating !== undefined && isNaN(rating))) {
//     return NextResponse.json(
//       createApiError("Invalid numeric parameters", 400, "BAD_REQUEST"),
//       { status: 400 }
//     );
//   }

//   if (sortBy && !["rating", "date", "reviewerName"].includes(sortBy)) {
//     return NextResponse.json(
//       createApiError(
//         "Invalid sortBy parameter. Must be one of: rating, date, reviewerName",
//         400,
//         "BAD_REQUEST"
//       ),
//       { status: 400 }
//     );
//   }

//   return {
//     limit,
//     sortBy: sortBy || undefined,
//     sortOrder: searchParams.get("sortOrder") === "desc" ? "desc" : "asc",
//     productId,
//     rating,
//   };
// };


export interface ReviewsQueryParams {
  limit: number;
  page: number;
  sortBy?: "rating" | "date" | "reviewerName";
  sortOrder: "asc" | "desc";
  productId?: string;
  rating?: number;
}

export const parseReviewsQueryParams = (
  request: NextRequest
): ReviewsQueryParams | NextResponse => {
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);

  const sortBy = (searchParams.get("sortBy") || null) as
    | "rating"
    | "date"
    | "reviewerName"
    | null;

  const productId = searchParams.get("productId") || undefined;
  const rating = searchParams.get("rating")
    ? parseFloat(searchParams.get("rating")!)
    : undefined;

  if (isNaN(limit) || isNaN(page) || (rating !== undefined && isNaN(rating))) {
    return NextResponse.json(
      createApiError("Invalid numeric parameters", 400, "BAD_REQUEST"),
      { status: 400 }
    );
  }

  if (sortBy && !["rating", "date", "reviewerName"].includes(sortBy)) {
    return NextResponse.json(
      createApiError(
        "Invalid sortBy parameter. Must be one of: rating, date, reviewerName",
        400,
        "BAD_REQUEST"
      ),
      { status: 400 }
    );
  }

  return {
    limit,
    page,
    sortBy: sortBy || undefined,
    sortOrder: searchParams.get("sortOrder") === "desc" ? "desc" : "asc",
    productId,
    rating,
  };
};

export const buildReviewsWhereClause = (params: {
  productId?: string;
  rating?: number;
}): Record<string, unknown> => {
  const where: Record<string, unknown> = {};

  if (params.productId) {
    where.productId = params.productId;
  }

  if (params.rating) {
    where.rating = params.rating;
  }

  return where;
};

// export const buildReviewsOrderBy = (params: {
//   sortBy?: "rating" | "date" | "reviewerName";
//   sortOrder: "asc" | "desc";
// }): Record<string, "asc" | "desc"> | undefined => {
//   if (!params.sortBy) {
//     return { date: "desc" }; // Default sort by date descending
//   }

//   return {
//     [params.sortBy]: params.sortOrder,
//   };
// };


// reviews-query-params.ts (same file or exported function)
export const buildReviewsOrderBy = (params: {
  sortBy?: "rating" | "date" | "reviewerName";
  sortOrder: "asc" | "desc";
}): Record<string, "asc" | "desc"> | undefined => {
  if (!params.sortBy) {
    return { createdAt: "desc" };
  }

  const map: Record<string, string> = {
    date: "createdAt",
    rating: "rating",
    reviewerName: "reviewerName",
  };

  const field = map[params.sortBy] || "createdAt";

  return { [field]: params.sortOrder };
};

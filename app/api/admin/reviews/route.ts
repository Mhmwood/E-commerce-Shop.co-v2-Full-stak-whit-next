import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";
import { buildReviewsOrderBy, buildReviewsWhereClause, parseReviewsQueryParams } from "@/lib/api/products-utils/reviews-query-params";
import { checkServerAdmin } from "@/lib/auth/role-utils";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = createAsyncRoute(async (request: NextRequest) => {
  const { hasAccess, error } = await checkServerAdmin();

  if (!hasAccess) {
    return NextResponse.json(
      { error: error || "Access denied" },
      { status: 403 }
    );
  }

  const queryParams = parseReviewsQueryParams(request);
  if (queryParams instanceof NextResponse) return queryParams;

  const { limit, page = 1, productId, rating, sortBy, sortOrder } = queryParams;

  const where = buildReviewsWhereClause({ productId, rating });
  const orderBy = buildReviewsOrderBy({ sortBy, sortOrder });

  const totalCount = await prisma.productReview.count({ where });

  const reviews = await prisma.productReview.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      product: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json({ totalCount, data: reviews }, { status: 200 });
});

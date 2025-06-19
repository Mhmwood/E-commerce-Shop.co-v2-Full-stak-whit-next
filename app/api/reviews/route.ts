// File: app/api/reviews/route.ts (for POST and GET all)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";
import {
  parseReviewsQueryParams,
  buildReviewsWhereClause,
  buildReviewsOrderBy,
} from "@/lib/api/products-utils/reviews-query-params";
import { CreateReviewSchema } from "@/validations/reviewSchema";

export const GET = createAsyncRoute(async (request: NextRequest) => {
  const queryParams = parseReviewsQueryParams(request);
  if (queryParams instanceof NextResponse) return queryParams;

  const { limit, productId, rating, sortBy, sortOrder } = queryParams;

  const where = buildReviewsWhereClause({ productId, rating });
  const orderBy = buildReviewsOrderBy({ sortBy, sortOrder });

  const totalCount = await prisma.productReview.count({ where });

  const reviews = await prisma.productReview.findMany({
    where,
    orderBy,
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

  return NextResponse.json(
    {
      totalCount: totalCount,
      data: reviews,
    },
    { status: 200 }
  );
});

export const POST = createAsyncRoute(async (request: NextRequest) => {
  const rawData = await request.json();

  // Validate the request data
  const validation = CreateReviewSchema.safeParse(rawData);
  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const validatedData = validation.data;

  const product = await prisma.product.findUnique({
    where: { id: validatedData.productId },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({
    where: { id: validatedData.userId },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existingReview = await prisma.productReview.findFirst({
    where: {
      userId: validatedData.userId,
      productId: validatedData.productId,
    },
  });

  if (existingReview) {
    return NextResponse.json(
      { error: "User has already reviewed this product" },
      { status: 409 }
    );
  }

  const review = await prisma.productReview.create({
    data: {
      rating: validatedData.rating,
      comment: validatedData.comment,
      date: new Date(),
      reviewerName: user.name,
      productId: product.id,
      userId: user.id,
    },
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

  return NextResponse.json(review, { status: 201 });
});

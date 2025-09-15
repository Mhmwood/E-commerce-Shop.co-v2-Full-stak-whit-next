import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";

import { CreateReviewSchema } from "@/validations/reviewSchema";
import { updateProductRating } from "@/lib/api/products-utils/updateProductRating";

export const GET = createAsyncRoute(async (request: NextRequest) => {
  const reviews = await prisma.productReview.findMany({
    // Limit to reviews with a specific userId , productId for testing, since there aren't many users
    where: {
      userId: {
        equals: "aa55bb5c-e771-44fd-b3a8-7f1df7c43e77",
      },
      rating: {
        gt: 3,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
  return NextResponse.json(reviews, { status: 201 });
});
export const POST = createAsyncRoute(async (request: NextRequest) => {
  const rawData = await request.json();

  const validation = CreateReviewSchema.safeParse(rawData);
  if (!validation.success) {
    console.log(validation.error.issues);
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
      reviewerName: validatedData.reviewerName,
      productId: product.id,
      userId: validatedData.userId,
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

  await updateProductRating(product.id);

  return NextResponse.json(review, { status: 201 });
});

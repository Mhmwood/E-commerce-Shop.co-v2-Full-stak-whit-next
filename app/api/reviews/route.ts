
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";

import { CreateReviewSchema } from "@/validations/reviewSchema";

export const POST = createAsyncRoute(async (request: NextRequest) => {
  const rawData = await request.json();

  // Validate the request data
  const validation = CreateReviewSchema.safeParse(rawData);
  if (!validation.success) {
    console.log(validation.error.issues)
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

  return NextResponse.json(review, { status: 201 });
});

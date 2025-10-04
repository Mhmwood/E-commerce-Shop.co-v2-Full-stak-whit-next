import { createAsyncRoute } from "@lib/api/asyncRoute.ts";
import { updateProductRating } from "@lib/api/products-utils/updateProductRating";
import { authOptions } from "@lib/auth/auth";
import { checkServerAdmin } from "@lib/auth/role-utils";

import { prisma } from "@lib/prisma";
import { UpdateReviewSchema } from "@validations/reviewSchema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = createAsyncRoute(
  async (request: NextRequest, params?: { [key: string]: string }) => {
    const session = await getServerSession(authOptions);

    const id = params?.id;

    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    const rawData = await request.json();

    const validation = UpdateReviewSchema.safeParse(rawData);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const validatedData = validation.data;
    const existingReview = await prisma.productReview.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    if (existingReview.userId !== session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedReview = await prisma.productReview.update({
      where: { id },
      data: validatedData,
      include: {
        user: true,
        product: true,
      },
    });

    await updateProductRating(updatedReview.productId);

    return NextResponse.json(updatedReview);
  }
);

export const DELETE = createAsyncRoute(
  async (request: NextRequest, params?: { [key: string]: string }) => {
    const { user, hasAccess } = await checkServerAdmin();

    const id = params?.id;

    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    const existingReview = await prisma.productReview.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    if (existingReview.userId !== user?.id && !hasAccess) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.productReview.delete({
      where: { id },
    });

    await updateProductRating(existingReview.productId);

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  }
);

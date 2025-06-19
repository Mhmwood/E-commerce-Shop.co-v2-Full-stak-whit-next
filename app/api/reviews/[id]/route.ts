import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";
import { prisma } from "@/lib/prisma";
import { UpdateReviewSchema } from "@/validations/reviewSchema";
import { NextRequest, NextResponse } from "next/server";

export const GET = createAsyncRoute(
  async (request: NextRequest, params?: { [key: string]: string }) => {
    const id = Number(params?.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    const review = await prisma.productReview.findMany({
      where: { id },
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

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(review);
  }
);

// UPDATE review by ID
export const PATCH = createAsyncRoute(
  async (request: NextRequest, params?: { [key: string]: string }) => {
    const id = Number(params?.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    // Check if review exists
    const existingReview = await prisma.productReview.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const rawData = await request.json();

    // Validate the request data
    const validation = UpdateReviewSchema.safeParse(rawData);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    // Update the review
    const updatedReview = await prisma.productReview.update({
      where: { id },
      data: validatedData,
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

    return NextResponse.json(updatedReview);
  }
);

// DELETE review by ID
export const DELETE = createAsyncRoute(
  async (request: NextRequest, params?: { [key: string]: string }) => {
    const id = Number(params?.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    // Check if review exists
    const existingReview = await prisma.productReview.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Delete the review
    await prisma.productReview.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  }
);

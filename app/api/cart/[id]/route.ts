import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// PUT - Update cart item quantity
export const PUT = createAsyncRoute(
  async (request: NextRequest, params?: { [key: string]: string }) => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const cartItemId = Number(params?.id);
    if (isNaN(cartItemId)) {
      return NextResponse.json(
        { error: "Invalid cart item ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { quantity } = body;

    if (quantity === undefined || quantity < 0) {
      return NextResponse.json(
        { error: "Quantity must be 0 or greater" },
        { status: 400 }
      );
    }

    // Check if cart item exists and belongs to user
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id,
      },
      include: {
        product: {
          select: {
            id: true,
            stock: true,
          },
        },
      },
    });

    if (!existingCartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // If quantity is 0, delete the cart item
    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: {
          id: cartItemId,
        },
      });

      return NextResponse.json(
        { message: "Cart item removed" },
        { status: 200 }
      );
    }

    // Check stock availability
    if (existingCartItem.product.stock < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock available" },
        { status: 400 }
      );
    }

    // Update cart item quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity: quantity,
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            thumbnail: true,
            category: true,
            discountPercentage: true,
            stock: true,
          },
        },
      },
    });

    return NextResponse.json(updatedCartItem);
  }
);

// DELETE - Remove cart item
export const DELETE = createAsyncRoute(
  async (_request: NextRequest, params?: { [key: string]: string }) => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const cartItemId = Number(params?.id);
    if (isNaN(cartItemId)) {
      return NextResponse.json(
        { error: "Invalid cart item ID" },
        { status: 400 }
      );
    }

    // Check if cart item exists and belongs to user
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id,
      },
    });

    if (!existingCartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    return NextResponse.json(
      { message: "Cart item removed successfully" },
      { status: 200 }
    );
  }
);

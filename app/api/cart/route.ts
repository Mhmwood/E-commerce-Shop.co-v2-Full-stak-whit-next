import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";
import { authOptions } from "@/lib/auth/auth";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET - Retrieve user's cart items
export const GET = createAsyncRoute(async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }


  const cartItems = await prisma.cartItem.findMany({
    where: {
      userId: session.user.id,
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
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(cartItems);
});

// POST - Add item to cart
export const POST = createAsyncRoute(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const body = await request.json();
  const { productId, quantity = 1 } = body;

  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  if (quantity <= 0) {
    return NextResponse.json(
      { error: "Quantity must be greater than 0" },
      { status: 400 }
    );
  }

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, stock: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (product.stock < quantity) {
    return NextResponse.json(
      { error: "Insufficient stock available" },
      { status: 400 }
    );
  }



  // Check if item already exists in cart
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId: productId,
      },
    },
  });

  let cartItem;

  if (existingCartItem) {
    const newQuantity = existingCartItem.quantity + quantity;

    if (product.stock < newQuantity) {
      return NextResponse.json(
        { error: "Insufficient stock available" },
        { status: 400 }
      );
    }

    cartItem = await prisma.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: {
        quantity: newQuantity,
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
  } else {
    // Create new cart item
    cartItem = await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        productId: productId,
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
  }

  return NextResponse.json(cartItem, { status: 201 });
});

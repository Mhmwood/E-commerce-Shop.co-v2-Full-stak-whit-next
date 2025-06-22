import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";
import { prisma } from "@/lib/prisma";
import { getSelectQuerys } from "@/lib/api/products-utils/products-query-params";

import { NextRequest, NextResponse } from "next/server";
// assuming you have this

export const GET = createAsyncRoute(
  async (request: NextRequest, params?: { [key: string]: string }) => {
    const id = Number(params?.id);

    const select = getSelectQuerys(request);
    if (select instanceof NextResponse) return select;

    if (isNaN(id))
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );

    const product = await prisma.product.findUnique({
      where: { id },
      ...(select
        ? {
            select: {
              ...select,
              dimensions: true,
              meta: true,
              reviews: true,
              cartItems: true,
            },
          }
        : ({
            include: {
              cartItems: true,
              dimensions: true,
              meta: true,
              reviews: true,
            },
          } as any)),
          
    });

    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(product);
  }
);

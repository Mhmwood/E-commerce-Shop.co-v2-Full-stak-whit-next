import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";
import { prisma } from "@/lib/prisma";
import { getSelectQuerys } from "@/lib/api/products-utils/products-query-params";

import { NextRequest, NextResponse } from "next/server";
// assuming you have this

export const GET = createAsyncRoute(
  async (request: NextRequest, params?: { [key: string]: string }) => {
    const id = params?.id;

    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }
    const select = getSelectQuerys(request);
    if (select instanceof NextResponse) return select;

    const product = await prisma.product.findUnique({
      where: { id },
      ...(select
        ? {
            select: {
              ...select,
              dimensions: true,
              meta: true,
              reviews: {
                orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
              },
              cartItems: true,
            },
          }
        : ({
            include: {
              cartItems: true,
              dimensions: true,
              meta: true,
              reviews: {
                orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
              },
            },
          } as any)),
    });

    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(product);
  }
);

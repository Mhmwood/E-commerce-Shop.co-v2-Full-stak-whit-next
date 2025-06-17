import { createAsyncRoute } from "@/lib/asyncRoute.ts";
import { prisma } from "@/lib/prisma";
import { UpdateProductSchema } from "@/validations/productSchema";
import { NextRequest, NextResponse } from "next/server";
// assuming you have this

export const GET = createAsyncRoute(
  async (request: NextRequest, params?: { [key: string]: string }) => {
    const id = Number(params?.id);
    if (isNaN(id))
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        dimensions: true,
        meta: true,
        reviews: true,
      },
    });

    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(product);
  }
);

export const PATCH = createAsyncRoute(
  async (request: NextRequest, params?: { [key: string]: string }) => {
    const id = Number(params?.id);
    if (isNaN(id))
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const rawData = await request.json();

    const validation = UpdateProductSchema.safeParse(rawData);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json(updatedProduct);
  }
);

export const DELETE = createAsyncRoute(
  async (request: NextRequest, params?: { [key: string]: string }) => {
    const id = Number(params?.id);
    if (isNaN(id))
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );

    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  }
);

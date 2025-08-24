import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";
import { checkServerAdmin } from "@/lib/auth/role-utils";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/upload/deleteImg";
import { UpdateProductSchema } from "@/validations/productSchema";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = createAsyncRoute(
  async (request: NextRequest, params?: { [key: string]: string }) => {
    const { hasAccess, error } = await checkServerAdmin();

    if (!hasAccess) {
      return NextResponse.json(
        { error: error || "Access denied" },
        { status: 403 }
      );
    }
    const id = params?.id;

    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

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
    const { hasAccess, error } = await checkServerAdmin();

    if (!hasAccess) {
      return NextResponse.json(
        { error: error || "Access denied" },
        { status: 403 }
      );
    }

    const id = params?.id;

    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (product?.images) {
      for (const image of product?.images) {
        await deleteImage(image, "products");
      }
    }
    if (product?.thumbnail) await deleteImage(product.thumbnail, "products");

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  }
);

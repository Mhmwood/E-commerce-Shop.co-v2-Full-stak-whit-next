import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";
import { checkServerAdmin } from "@/lib/auth/role-utils";
import { prisma } from "@/lib/prisma";
import { ProductSchema } from "@/validations/productSchema";
import { NextRequest, NextResponse } from "next/server";

export const POST = createAsyncRoute(async (request: NextRequest) => {
     const { hasAccess, error } = await checkServerAdmin();

     if (!hasAccess) {
       return NextResponse.json(
         { error: error || "Access denied" },
         { status: 403 }
       );
     }


  const rawData = await request.json();
  const validation = ProductSchema.safeParse(rawData);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: validation.data,
  });

  return NextResponse.json(product, { status: 201 });
});

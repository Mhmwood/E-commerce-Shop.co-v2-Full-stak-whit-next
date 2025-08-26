import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkServerAdmin } from "@/lib/auth/role-utils";

export const GET = createAsyncRoute(async () => {
  const { hasAccess, error } = await checkServerAdmin();
  if (!hasAccess) {
    return NextResponse.json(
      { error: error || "Access denied" },
      { status: 403 }
    );
  }
  const [productCount, userCount, reviewCount] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.productReview.count(),
  ]);
 
  return NextResponse.json({
    productCount,
    userCount,
    reviewCount,

  });
});

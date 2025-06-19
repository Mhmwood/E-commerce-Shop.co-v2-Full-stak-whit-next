import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = createAsyncRoute(async () => {
  const categories = await prisma.product.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
    where: {
      category: {
        not: null,
      },
    },
  });

  const categoryNames = categories
    .map((item) => item.category)
    .filter((category) => category && category !== "Uncategorized");

  return NextResponse.json(categoryNames);
});

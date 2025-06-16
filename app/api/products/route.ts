import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";
import { generateOrderBy } from "@/lib/products-utils/generateOrderBy";
import {
  buildSelectObject,
  buildWhereClause,
  parseQueryParams,
} from "@/lib/products-utils/query-params";
import { createAsyncRoute } from "@/lib/asyncRoute.ts";
import { ProductSchema } from "@/validations/productSchema";
import { createApiError } from "@/lib/errHandle";

export const GET = createAsyncRoute(async (request: NextRequest) => {
  const params = parseQueryParams(request);
  if (params instanceof NextResponse) return params;

  const select = buildSelectObject(params.selectFields);
  const where = buildWhereClause(params);

  const orderBy = generateOrderBy(params.sortBy || null, params.sortOrder);
  if (orderBy instanceof NextResponse) return orderBy;

  const skip = (params.page - 1) * params.limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: params.limit,
      select: {
        ...select,
        category: true,
      },
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    page: params.page,
    limit: params.limit,
    total,
    products,
  });
});

export const POST = createAsyncRoute(async (request: NextRequest) => {
  const rawData = await request.json();
  if (!rawData.category) {
    const error = createApiError("Category is required", 400, "BAD_REQUEST");
    return NextResponse.json(error, { status: error.status });
  }

  const categoryName = rawData.category.toLowerCase();

  const category = await prisma.category.upsert({
    where: { name: categoryName },
    create: { name: categoryName },
    update: {},
  });

  delete rawData.category;

  const validation = ProductSchema.safeParse({
    ...rawData,
    categoryId: category.id,
  });
  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: validation.data,
    include: {
      category: true,
    },
  });

  return NextResponse.json(product, { status: 201 });
});

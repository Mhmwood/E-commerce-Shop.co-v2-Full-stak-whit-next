import { prisma } from "@lib/prisma";

import { NextRequest, NextResponse } from "next/server";
import { generateOrderBy } from "@lib/api/products-utils/generateOrderBy";
import {
  buildSelectObject,
  buildWhereClause,
  parseQueryParams,
} from "@lib/api/products-utils/products-query-params";
import { createAsyncRoute } from "@lib/api/asyncRoute.ts";

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
      select,
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

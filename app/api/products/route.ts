import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/errHandle";
import { NextRequest, NextResponse } from "next/server";
import { generateOrderBy } from "@/lib/products-utl/generateOrderBy";
import {
  buildSelectObject,
  buildWhereClause,
  parseQueryParams,
} from "@/lib/products-utl/query-params";

export const GET = async (request: NextRequest) => {
  try {
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
  } catch (error) {
    const handledError = handlePrismaError(error);
    return NextResponse.json(handledError, {
      status: handledError.status || 500,
    });
  }
};

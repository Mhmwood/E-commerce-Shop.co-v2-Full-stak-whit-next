import { NextRequest, NextResponse } from "next/server";
import { createApiError } from "../errHandle";
import { LIMIT_DEFAULT } from "../constinst";

export interface QueryParams {
  minPrice: number;
  maxPrice: number;
  page: number;
  limit: number;
  category?: string;
  search?: string;
  selectFields?: string;
  sortBy?: string;
  sortOrder: "asc" | "desc";
}

export const parseQueryParams = (
  request: NextRequest
): QueryParams | NextResponse => {
  const { searchParams } = new URL(request.url);

  const minPrice = parseFloat(searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "9999999");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || LIMIT_DEFAULT);

  if (isNaN(page) || isNaN(limit) || isNaN(minPrice) || isNaN(maxPrice)) {
    return NextResponse.json(
      createApiError("Invalid numeric parameters", 400, "BAD_REQUEST"),
      { status: 400 }
    );
  }

  return {
    minPrice,
    maxPrice,
    page,
    limit,
    category: searchParams.get("category") || undefined,
    search: searchParams.get("query") || undefined,
    selectFields: searchParams.get("select") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    sortOrder: searchParams.get("sortOrder") === "desc" ? "desc" : "asc",
  };
};

export const buildSelectObject = (
  selectFields?: string
): Record<string, boolean> | undefined => {
  if (!selectFields) return undefined;

  return selectFields.split(",").reduce((acc, field) => {
    acc[field.trim()] = true;
    return acc;
  }, {} as Record<string, boolean>);
};

export const buildWhereClause = (params: {
  minPrice: number;
  maxPrice: number;
  category?: string;
  search?: string;
}): Record<string, unknown> => {
  const where: Record<string, unknown> = {
    price: {
      gte: params.minPrice,
      lte: params.maxPrice,
    },
  };

  if (params.category) {
    where.category = {
      equals: params.category,
      mode: "insensitive",
    };
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return where;
};

export const getSelectQuerys = (request: NextRequest) => {
  const query = parseQueryParams(request);
  if (query instanceof NextResponse) return query;
  return buildSelectObject(query.selectFields);
};

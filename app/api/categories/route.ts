import { handlePrismaError } from "@/lib/errHandle";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        name: true,
      },
    });
    const categoryNames = categories.map((category) => category.name);
    return NextResponse.json(categoryNames);
  } catch (error) {
    const handledError = handlePrismaError(error);
    return NextResponse.json(handledError, {
      status: handledError.status || 500,
    });
  }
};

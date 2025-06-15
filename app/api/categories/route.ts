import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  const categories = await prisma.category.findMany({
    select: {
      name: true,
    },
  });

  return NextResponse.json(categories);
};

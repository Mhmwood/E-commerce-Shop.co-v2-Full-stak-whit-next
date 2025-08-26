import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";
import { prisma } from "@/lib/prisma";
import { SignUpSchema } from "@/validations/authSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { checkServerAdmin } from "@/lib/auth/role-utils";

export const POST = createAsyncRoute(async (request: NextRequest) => {
  const rawData = await request.json();

  
  const validation = SignUpSchema.safeParse(rawData);
  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, password, image, role } = validation.data;


  if (role === "ADMIN") {
    const { hasAccess } = await checkServerAdmin();
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Only administrators can create admin accounts" },
        { status: 403 }
      );
    }
  }


  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "User with this email already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      image,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    },
  });

  return NextResponse.json(
    {
      message: "User created successfully",
      user,
    },
    { status: 201 }
  );
});

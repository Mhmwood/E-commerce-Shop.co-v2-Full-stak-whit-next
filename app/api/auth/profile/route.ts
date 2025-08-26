import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";
import { prisma } from "@/lib/prisma";
import {
  ProfileUpdateSchema,
  ChangePasswordSchema,
  AdminProfileUpdateSchema,
} from "@/validations/authSchema";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import bcrypt from "bcryptjs";
import { checkServerAdmin } from "@/lib/auth/role-utils";



export const GET = createAsyncRoute(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);

  console.log("sessin", session);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
});

export const PATCH = createAsyncRoute(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawData = await request.json();

  
  const isAdminOperation = "role" in rawData;

  let validation;
  if (isAdminOperation) {

    const { hasAccess } = await checkServerAdmin();
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Only administrators can update roles" },
        { status: 403 }
      );
    }
    validation = AdminProfileUpdateSchema.safeParse(rawData);
  } else {

    validation = ProfileUpdateSchema.safeParse(rawData);
  }

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const validatedData = validation.data;


  if (validatedData.email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: validatedData.email,
        id: { not: session.user.id },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already taken" },
        { status: 409 }
      );
    }
  }


  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: validatedData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  return NextResponse.json(updatedUser);
});

export const PUT = createAsyncRoute(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawData = await request.json();

  const validation = ChangePasswordSchema.safeParse(rawData);
  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const { currentPassword, newPassword } = validation.data;


  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  if (!user?.password) {
    return NextResponse.json(
      { error: "User not found or no password set" },
      { status: 404 }
    );
  }


  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 }
    );
  }


  const hashedNewPassword = await bcrypt.hash(newPassword, 12);


  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedNewPassword },
  });

  return NextResponse.json(
    { message: "Password changed successfully" },
    { status: 200 }
  );
});

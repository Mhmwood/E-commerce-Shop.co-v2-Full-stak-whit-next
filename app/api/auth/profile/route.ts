import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";
import { prisma } from "@/lib/prisma";
import {
  ProfileUpdateSchema,
  ChangePasswordSchema,
  AdminProfileUpdateSchema,
  AdminUserManagementSchema,
} from "@/validations/authSchema";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import bcrypt from "bcryptjs";
//import { checkServerAdmin } from "@/lib/role-utils";

// GET user profile
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
      // updatedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
});

// UPDATE user profile
export const PATCH = createAsyncRoute(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawData = await request.json();

  // Check if this is an admin operation (includes role field)
  const isAdminOperation = "role" in rawData;

  //let validation;
  // if (isAdminOperation) {
  //   // Admin can update roles
  //   const { hasAccess } = await checkServerAdmin();
  //   if (!hasAccess) {
  //     return NextResponse.json(
  //       { error: "Only administrators can update roles" },
  //       { status: 403 }
  //     );
  //   }
  //   validation = AdminProfileUpdateSchema.safeParse(rawData);
  // } else {
  // Regular user profile update
  const validation = ProfileUpdateSchema.safeParse(rawData);
  // }

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const validatedData = validation.data;

  // Check if email is being updated and if it's already taken
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

  // Update the user
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
      updatedAt: true,
    },
  });

  return NextResponse.json(updatedUser);
});

// Change password
export const PUT = createAsyncRoute(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawData = await request.json();

  // Check if this is an admin user management operation
  if ("userId" in rawData && "role" in rawData) {
    const { hasAccess } = await checkServerAdmin();
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Only administrators can manage user roles" },
        { status: 403 }
      );
    }

    const validation = AdminUserManagementSchema.safeParse(rawData);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, role } = validation.data;

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "User role updated successfully",
      user: updatedUser,
    });
  }

  // Regular password change
  const validation = ChangePasswordSchema.safeParse(rawData);
  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const { currentPassword, newPassword } = validation.data;

  // Get current user with password
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

  // Verify current password
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

  // Hash new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  // Update password
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedNewPassword },
  });

  return NextResponse.json(
    { message: "Password changed successfully" },
    { status: 200 }
  );
});

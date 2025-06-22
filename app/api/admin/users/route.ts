import { createAsyncRoute } from "@/lib/api/asyncRoute.ts";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { checkServerAdmin } from "@/lib/auth/role-utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import bcrypt from "bcryptjs";

// GET all users (admin only)
export const GET = createAsyncRoute(async (request: NextRequest) => {
  const { hasAccess, error } = await checkServerAdmin();

  if (!hasAccess) {
    return NextResponse.json(
      { error: error || "Access denied" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role) {
    where.role = role;
  }

  // Get total count
  const totalCount = await prisma.user.count({ where });

  // Get users with pagination
  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      emailVerified: true,
      createdAt: true,
      _count: {
        select: {
          reviews: true,
          orders: true,
          cartItems: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  const totalPages = Math.ceil(totalCount / limit);

  return NextResponse.json({
    users,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    filters: {
      search,
      role,
    },
  });
});
// POST for creating a user (admin only)
export const POST = createAsyncRoute(async (request: NextRequest) => {
  const { hasAccess, error } = await checkServerAdmin();

  if (!hasAccess) {
    return NextResponse.json(
      { error: error || "Access denied" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { email, password, name, role } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  // Basic validation
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters long" },
      { status: 400 }
    );
  }

  if (role && !["USER", "ADMIN"].includes(role)) {
    return NextResponse.json(
      { error: "Invalid role. Must be 'USER' or 'ADMIN'." },
      { status: 400 }
    );
  }

  // Check if user already exists
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

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: role || "USER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      emailVerified: true,
      createdAt: true,
      _count: {
        select: {
          reviews: true,
          orders: true,
          cartItems: true,
        },
      },
    },
  });

  // Don't return the hashed password

  return NextResponse.json(newUser, { status: 201 });
});

// PUT for updating a user (admin only)
export const PUT = createAsyncRoute(async (request: NextRequest) => {
  const { hasAccess, error } = await checkServerAdmin();

  if (!hasAccess) {
    return NextResponse.json(
      { error: error || "Access denied" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { userId, role } = body;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  if (!role) {
    return NextResponse.json({ error: "Role is required" }, { status: 400 });
  }

  if (role !== "USER" && role !== "ADMIN") {
    return NextResponse.json(
      { error: "Invalid role. Must be 'USER' or 'ADMIN'." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      emailVerified: true,
      createdAt: true,
      _count: {
        select: {
          reviews: true,
          orders: true,
          cartItems: true,
        },
      },
    },
  });

  return NextResponse.json(updatedUser, { status: 200 });
});


// DELETE user (admin only)
export const DELETE = createAsyncRoute(async (request: NextRequest) => {
  const { hasAccess, error } = await checkServerAdmin();

  if (!hasAccess) {
    return NextResponse.json(
      { error: error || "Access denied" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Prevent admin from deleting themselves
  const session = await getServerSession(authOptions);
  if (session?.user?.id === userId) {
    return NextResponse.json(
      { error: "Cannot delete your own account" },
      { status: 400 }
    );
  }

  // Delete user (cascade will handle related data)
  await prisma.user.delete({
    where: { id: userId },
  });

  return NextResponse.json(
    { message: "User deleted successfully" },
    { status: 200 }
  );
});


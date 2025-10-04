import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { Role } from "@validations/authSchema";

export const ROLE_HIERARCHY = {
  USER: 1,
  ADMIN: 2,
} as const;

export const hasRole = (userRole: Role, requiredRole: Role): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

export const isAdmin = (role: Role): boolean => {
  return role === "ADMIN";
};

export const isUser = (role: Role): boolean => {
  return hasRole(role, "USER");
};

export const checkServerRole = async (requiredRole: Role = "USER") => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    return { hasAccess: false, user: null, error: "Not authenticated" };
  }

  const hasAccess = hasRole(session.user.role, requiredRole);

  return {
    hasAccess,
    user: session.user,
    error: hasAccess ? null : "Insufficient permissions",
  };
};

export const checkServerAdmin = async () => {
  return checkServerRole("ADMIN");
};

export const checkClientRole = (
  userRole: Role | undefined,
  requiredRole: Role = "USER"
) => {
  if (!userRole) {
    return { hasAccess: false, error: "Not authenticated" };
  }

  const hasAccess = hasRole(userRole, requiredRole);

  return {
    hasAccess,
    error: hasAccess ? null : "Insufficient permissions",
  };
};

export const checkClientAdmin = (userRole: Role | undefined) => {
  return checkClientRole(userRole, "ADMIN");
};

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { Role } from "@/validations/authSchema";

// Role hierarchy
export const ROLE_HIERARCHY = {
  USER: 1,
  ADMIN: 2,
} as const;

// Check if user has required role
export const hasRole = (userRole: Role, requiredRole: Role): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

// Check if user has admin role
export const isAdmin = (role: Role): boolean => {
  return role === "ADMIN";
};

// Check if user has user role or higher
export const isUser = (role: Role): boolean => {
  return hasRole(role, "USER");
};

// Server-side role check
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

// Server-side admin check
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

// Client-side admin check
export const checkClientAdmin = (userRole: Role | undefined) => {
  return checkClientRole(userRole, "ADMIN");
};

// Role-based route protection
export const withRoleProtection = (requiredRole: Role = "USER") => {
  return async () => {
    const { hasAccess, error } = await checkServerRole(requiredRole);

    if (!hasAccess) {
      return new Response(JSON.stringify({ error: error || "Access denied" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    return null; // Continue with the request
  };
};

// Admin-only route protection
export const withAdminProtection = () => {
  return withRoleProtection("ADMIN");
};

// Role-based component props
export interface RoleBasedProps {
  userRole?: Role;
  requiredRole?: Role;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

// // Role-based component wrapper
// export const RoleBasedComponent = ({
//   userRole,
//   requiredRole = "USER",
//   fallback = null,
//   children,
// }: RoleBasedProps) => {
//   const { hasAccess } = checkClientRole(userRole, requiredRole);

//   if (!hasAccess) {
//     return <>{fallback}</>;
//   }

//   return <>{children}</>;
// };

// // Admin-only component wrapper
// export const AdminOnlyComponent = ({
//   userRole,
//   fallback = null,
//   children,
// }: Omit<RoleBasedProps, "requiredRole">) => {
//   return (
//     <RoleBasedComponent
//       userRole={userRole}
//       requiredRole="ADMIN"
//       fallback={fallback}
//     >
//       {children}
//     </RoleBasedComponent>
//   );
// };

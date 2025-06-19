"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignInInput, SignUpInput, Role } from "@/validations/authSchema";
import {
  signUpUser,
  updateProfile,
  changePassword,
  getUserProfile,
} from "@/lib/auth/auth-utils";
import { checkClientAdmin, checkClientRole } from "../auth/role-utils";

export const useAuth = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const userRole = session?.user?.role as Role | undefined;

  // Role-based checks
  const isAdmin = checkClientAdmin(userRole).hasAccess;
  const hasRole = (requiredRole: Role) =>
    checkClientRole(userRole, requiredRole).hasAccess;

  // Sign in
  const login = async (credentials: SignInInput) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      await update(); // Update session
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Sign in failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign up
  const register = async (userData: SignUpInput) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signUpUser(userData);

      if (!result.success) {
        setError(result.error || null);
        return result;
      }

      // Auto sign in after successful registration
      const signInResult = await signIn("credentials", {
        email: userData.email,
        password: userData.password,
        redirect: false,
        role: "USER",
      });

      if (signInResult?.error) {
        setError(signInResult.error);
        return { success: false, error: signInResult.error };
      }

      await update(); // Update session
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Sign up failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  // Sign out
  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await signOut({ redirect: false });
      router.push("/");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Sign out failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateUserProfile = async (profileData: {
    name?: string;
    email?: string;
    image?: string;
    role?: Role;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateProfile(profileData);

      if (!result.success) {
        setError(result.error || null);
        return result;
      }

      await update(); // Update session
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Profile update failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  // Change password
  const changeUserPassword = async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await changePassword(passwordData);

      if (!result.success) {
        setError(result.error || null);
        return result;
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Password change failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  // Get user profile
  const getUserProfileData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getUserProfile();

      if (!result.success) {
        setError(result.error || "Failed to get profile");
        return result;
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get profile";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  // Admin functions
  const updateUserRole = async (userId: string, role: Role) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Role update failed");
      }

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Role update failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getAllUsers = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", params.page.toString());
      if (params?.limit) searchParams.set("limit", params.limit.toString());
      if (params?.search) searchParams.set("search", params.search);
      if (params?.role) searchParams.set("role", params.role);

      const response = await fetch(
        `/api/admin/users?${searchParams.toString()}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get users");
      }

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get users";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete user";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return {
    // State
    session,
    isAuthenticated,
    isLoading,
    loading,
    error,
    userRole,

    // Role-based checks
    isAdmin,
    hasRole,

    // Actions
    login,
    register,
    logout,
    updateUserProfile,
    changeUserPassword,
    getUserProfileData,
    clearError,

    // Admin actions
    updateUserRole,
    getAllUsers,
    deleteUser,
  };
};

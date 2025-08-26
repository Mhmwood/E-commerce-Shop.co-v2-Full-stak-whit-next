"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignInInput, SignUpInput, Role } from "@/validations/authSchema";
import {
  signUpUser,
  updateProfile,
  changePassword,
  getUserProfile,
} from "@/lib/auth/auth-utils";
import { checkClientAdmin, checkClientRole } from "@/lib/auth/role-utils";

export const useAuth = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [cachedSession, setCachedSession] = useState<typeof session>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const saved = localStorage.getItem("session");
    if (saved) setCachedSession(JSON.parse(saved));
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    if (session) localStorage.setItem("session", JSON.stringify(session));
    else localStorage.removeItem("session");
  }, [session, isClient]);

  const effectiveSession = cachedSession ?? session;
  const isAuthenticated = status === "authenticated" || !!cachedSession;
  const isLoading = status === "loading";
  const userRole = effectiveSession?.user?.role as Role | undefined;

  const isAdmin = checkClientAdmin(userRole).hasAccess;
  const hasRole = (requiredRole: Role) =>
    checkClientRole(userRole, requiredRole).hasAccess;

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
      await update();
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

  const register = async (userData: SignUpInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signUpUser(userData);
      if (!result.success) {
        setError(result.error || null);
        return result;
      }
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
      await update();
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

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut({ redirect: false });
      localStorage.removeItem("session");
  setCachedSession(null);
  router.replace("/");

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

      await update({
        name: profileData.name,
        email: profileData.email,
        image: profileData.image,
        role: profileData.role,
      });

      router.refresh();
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
  };
};

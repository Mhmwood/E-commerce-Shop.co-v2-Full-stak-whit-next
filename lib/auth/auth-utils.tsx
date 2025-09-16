import { signIn, signOut, getSession } from "next-auth/react";
import { SignInInput, SignUpInput, Role } from "@validations/authSchema";

export const signInUser = async (credentials: SignInInput) => {
  try {
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Sign in failed",
    };
  }
};

export const signUpUser = async (userData: SignUpInput) => {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Sign up failed");
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Sign up failed",
    };
  }
};

export const signOutUser = async () => {
  try {
    await signOut({ redirect: false });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Sign out failed",
    };
  }
};

export const getCurrentSession = async () => {
  try {
    const session = await getSession();
    return { success: true, data: session };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get session",
    };
  }
};

export const updateProfile = async (profileData: {
  name?: string;
  email?: string;
  image?: string;
  role?: Role;
}) => {
  try {
    const response = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Profile update failed");
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Profile update failed",
    };
  }
};

export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  try {
    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Password change failed");
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Password change failed",
    };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await fetch("/api/auth/profile");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to get profile");
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get profile",
    };
  }
};


export const updateUserRole = async (userId: string, role: Role) => {
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
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Role update failed",
    };
  }
};

export const getAllUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.role) searchParams.set("role", params.role);

    const response = await fetch(`/api/admin/users?${searchParams.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to get users");
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get users",
    };
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await fetch(`/api/admin/users?userId=${userId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete user");
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
};

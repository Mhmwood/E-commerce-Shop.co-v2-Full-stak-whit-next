import { z } from "zod";

const nonEmptyString = z.string().trim().min(1, "Cannot be empty");

export const RoleEnum = z.enum(["ADMIN", "USER"]);

export const SignUpSchema = z
  .object({
    name: nonEmptyString
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

    email: z
      .string()
      .email("Invalid email format")
      .min(1, "Email is required")
      .max(100, "Email cannot exceed 100 characters"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password cannot exceed 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),

    confirmPassword: z.string(),
    image: z.string().optional().default("/images/default-user.png"),
    role: RoleEnum.optional().default("USER"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });


export const SignInSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const PasswordResetRequestSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
});

export const PasswordResetSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password cannot exceed 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const ProfileUpdateSchema = z.object({
  name: nonEmptyString
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .optional(),

  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is required")
    .max(100, "Email cannot exceed 100 characters")
    .optional(),

  image: z.string().url("Invalid image URL").optional(),
});

export const AdminProfileUpdateSchema = ProfileUpdateSchema.extend({
  role: RoleEnum.optional(),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password cannot exceed 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),

    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

export const AdminUserManagementSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: RoleEnum,
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
export type PasswordResetRequestInput = z.infer<
  typeof PasswordResetRequestSchema
>;
export type PasswordResetInput = z.infer<typeof PasswordResetSchema>;
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
export type AdminProfileUpdateInput = z.infer<typeof AdminProfileUpdateSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type AdminUserManagementInput = z.infer<
  typeof AdminUserManagementSchema
>;
export type Role = z.infer<typeof RoleEnum>;

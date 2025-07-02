"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "ADMIN"]),
});

type CreateUserInput = z.infer<typeof CreateUserSchema>;

export default function NewUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: { role: "USER" },
  });

  const onSubmit: SubmitHandler<CreateUserInput> = async (data) => {
    setIsLoading(true);
    setError(null);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin/users");
      router.refresh();
    } else {
      const errorData = await res.json();
      setError(errorData.error || "Failed to create user");
    }
    setIsLoading(false);
  };

  return (
    <main className="dark bg-gray-900 min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Create New User</h1>
      <div className="max-w-xl mx-auto bg-gray-800 rounded p-8 shadow-md">
        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Full Name
            </label>
            <input
              {...register("name")}
              id="name"
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white p-2"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white p-2"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              {...register("password")}
              id="password"
              type="password"
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white p-2"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-300"
            >
              Role
            </label>
            <select
              {...register("role")}
              id="role"
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white p-2"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
            {errors.role && (
              <p className="mt-2 text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
          >
            {isLoading ? "Creating User..." : "Create User"}
          </button>
        </form>
      </div>
    </main>
  );
}

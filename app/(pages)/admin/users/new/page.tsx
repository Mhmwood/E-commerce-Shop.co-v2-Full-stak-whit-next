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

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/users`, {
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
    <main className="min-h-screen bg-background text-primary py-10 md:py-20 px-4 md:px-20 mt-10 space-y-8 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full mx-auto rounded-2xl border border-gray-700 bg-background/80 shadow-lg p-6 md:p-10">
        <h2 className="text-xl font-bold mb-6 text-primary text-center">
          Create New User
        </h2>
        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <label
              htmlFor="name"
              className="font-semibold text-sm text-muted-foreground mb-1 block"
            >
              Full Name
            </label>
            <input
              {...register("name")}
              id="name"
              className="mt-1 block w-full bg-secondary placeholder:text-gray-400 border border-gray-700 rounded-lg shadow-sm text-primary px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
              placeholder="Full name"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="font-semibold text-sm text-muted-foreground mb-1 block"
            >
              Email Address
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className="mt-1 block w-full bg-secondary placeholder:text-gray-400 border border-gray-700 rounded-lg shadow-sm text-primary px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
              placeholder="Email address"
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
              className="font-semibold text-sm text-muted-foreground mb-1 block"
            >
              Password
            </label>
            <input
              {...register("password")}
              id="password"
              type="password"
              className="mt-1 block w-full bg-secondary placeholder:text-gray-400 border border-gray-700 rounded-lg shadow-sm text-primary px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
              placeholder="Password"
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
              className="font-semibold text-sm text-muted-foreground mb-1 block"
            >
              Role
            </label>
            <select
              {...register("role")}
              id="role"
              className="mt-1 block w-full bg-secondary border border-gray-700 rounded-lg shadow-sm text-primary px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
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
            className="w-full text-lg py-3 rounded-full border font-bold shadow-md bg-primary text-white hover:bg-primary/90 transition-all duration-300 disabled:bg-gray-500"
          >
            {isLoading ? "Creating User..." : "Create User"}
          </button>
        </form>
      </div>
    </main>
  );
}

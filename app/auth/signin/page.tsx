"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const { login, error, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login({ email, password });
    if (res.success) {
      router.push("/");
    }
  };
  const devhelper = (forAdmin: boolean = false) => {
    if (forAdmin) {
      setEmail("Admin@example.com");
      setPassword("TestPass123!");
      return;
    }
    setEmail("Nnn@example.com");
    setPassword("TestPass123!");
    return;
  };

  return (
    <main className="dark bg-gray-900 min-h-screen text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded shadow w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded font-bold"
        >
          {loading ? "Sign In ..." : error ? "Error" : "Sign In "}
        </button>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => devhelper(false)}
            className="px-2 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Dev Helper
          </button>
          <button
            type="button"
            onClick={() => devhelper(true)}
            className="px-2 py-1 text-xs rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Admin Helper
          </button>
        </div>
      </form>
    </main>
  );
}

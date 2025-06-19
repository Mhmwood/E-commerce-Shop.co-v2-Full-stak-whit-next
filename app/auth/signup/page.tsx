"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { uploadImage } from "@/lib/upload/imgeUpload";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const { register, error, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    
     let image = "/images/default-user.png"; // default

     if (imageFile) {
       try {
         image = await uploadImage(imageFile, "avatars");
       } catch (err) {
         console.error("Image upload failed:", err);
       }
     }


    const res = await register({
      name,
      email,
      password,
      confirmPassword,
      image,
    });
    if (res.success) {
      router.push("/");
    }
  };

  return (
    <main className="dark bg-gray-900 min-h-screen text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-10 rounded-2xl shadow-lg w-full"
        >
          <h1 className="text-3xl font-extrabold mb-8 text-center tracking-tight">
            Create your account
          </h1>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setconfirmPassword(e.target.value);
              }}
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium" htmlFor="image">
              Profile Image (optional)
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
          </div>

          {error && (
            <div className="mb-4 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-bold transition-colors duration-200"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Signing Up...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a
            href="/auth/signin"
            className="text-indigo-400 hover:underline font-medium"
          >
            Sign in
          </a>
        </div>
      </div>
    </main>
  );
}

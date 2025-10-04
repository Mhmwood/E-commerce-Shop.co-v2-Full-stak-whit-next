"use client";

import { useAuth } from "@hooks/useAuth";
import { uploadImage } from "@lib/upload/imgeUpload";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const { register, errorMsg, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgaload, setImgaload] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let image =
      "https://bkddaewshluqnvphgnqv.supabase.co/storage/v1/object/public/avatars/users/1750361164941-2cjwdmitlro.png"; // default

    if (imageFile) {
      setImgaload(true);
      try {
        image = await uploadImage(imageFile, "avatars");
      } catch (err) {
        console.error("Image upload failed:", err);
      } finally {
        setImgaload(false);
      }
    }

    const res = await register({
      name,
      email,
      password,
      confirmPassword,
      image,
      role: "USER", // Default role added
    });
    if (res.success) {
      router.push("/");
    }
  };

  const validatePassword = (password: string) => {
    const errors = [];
    if (!/(?=.*[a-z])/.test(password)) errors.push("one lowercase letter");
    if (!/(?=.*[A-Z])/.test(password)) errors.push("one uppercase letter");
    if (!/(?=.*\d)/.test(password)) errors.push("one number");
    if (!/(?=.*[@$!%*?&])/.test(password)) errors.push("one special character");
    if (password.length < 8) errors.push("at least 8 characters");
    return errors;
  };

  return (
    <main className="dark bg-secondary min-h-screen py-10 md:py-20 px-4 md:px-20 mt-10 text-primary flex items-center justify-center">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="border-2 p-8 rounded-2xl shadow w-full"
        >
          <h1 className="text-2xl font-bold mb-6 font-integral">
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
              className="w-full mb-4 py-3 px-2 rounded-lg focus:outline-1 focus:outline-gray-700"
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
              className="w-full mb-4 py-3 px-2 rounded-lg focus:outline-1 focus:outline-gray-700"
              required
            />
          </div>
          <div className="mb-5">
            <label
              className="block mb-2 text-sm font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                const newPassword = e.target.value;
                setPassword(newPassword);
                setconfirmPassword(newPassword);
                const errors = validatePassword(newPassword);
                if (errors.length > 0) {
                  setPasswordError(`${errors.join(", ")}.`);
                } else {
                  setPasswordError("");
                }
              }}
              className="w-full mb-4 py-3 px-2 rounded-lg focus:outline-1 focus:outline-gray-700"
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium" htmlFor="image">
              Profile Image (optional){" "}
              {imgaload && <span className="text-red-500">Loading...</span>}
            </label>

            {imageFile && (
              <div className="flex flex-col items-start gap-2">
                <Image
                  className="w-24 h-24 rounded-full object-cover"
                  src={URL.createObjectURL(imageFile)}
                  alt="Profile Image"
                  width={100}
                  height={100}
                />

                <label
                  htmlFor="image"
                  className="inline-block cursor-pointer bg-primary text-white hover:bg-primary/95 px-4 py-2 rounded text-xs font-semibold"
                  title="Change the image"
                >
                  Change Image
                </label>

                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="hidden "
                />
              </div>
            )}

            {!imageFile && (
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/95"
              />
            )}
          </div>

          {errorMsg && (
            <div className="mb-4 text-red-400 text-sm text-center">{errorMsg}</div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 font-bold rounded-3xl p-1 cursor-pointer border border-gray-700 hover:bg-primary hover:text-white transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
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

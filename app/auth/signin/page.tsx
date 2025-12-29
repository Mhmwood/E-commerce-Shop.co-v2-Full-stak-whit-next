"use client";

import { useAuth } from "@hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { GoogleIcon } from "@/components/GoogleIcon";
export default function SignInPage() {
  const { login, errorMsg, loading } = useAuth();
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


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const devhelper = (forAdmin: boolean = false) => {
    if (forAdmin) {
      setEmail(process.env.NEXT_PUBLIC_ADMIN_EMAIL || "name@example.com");
      setPassword(process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "password");
      return;
    }
    setEmail("User@example.com");
    setPassword("TestPass123!");
    return;
  };

  return (
    <main className="dark bg-secondary min-h-screen py-10 md:py-20 px-4 md:px-20 mt-10 text-primary flex items-center justify-center">
    
	
    <form
        onSubmit={handleSubmit}
        className="border-2 p-8 rounded-2xl shadow w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 font-integral">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 py-3 px-2 rounded-lg  outline-1  outline-gray-400 focus:outline-gray-700"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6  py-3 px-2 rounded-lg outline-1  outline-gray-400 focus:outline-gray-700"
          required
        />
        <button
          type="submit"
          className="w-full  px-4 py-2  font-bold rounded-3xl p-1 cursor-pointer border border-gray-700 hover:bg-primary hover:text-white transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {loading ? "Sign In ..." : errorMsg ? "failed" : "Sign In "}
        </button>
      <button                                                   type="submit"                                           className="w-full  px-4 py-2  font-bold rounded-3xl p-1 cursor-pointer border border-gray-700 hover:bg-primary hover:text-white transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40"           onClick={() => signIn("google")} >  
<

      <GoogleIcon className="mr-2 h-4 w-4" />
  Sign in with Google
      </button>
	
        {errorMsg && (
          <div className="mt-4 text-red-400 text-sm text-center">
            {errorMsg}
          </div>
        )}
        {/* {this just helpers for dev} */}

        {/* <div className="flex gap-2 mt-4">
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
        </div> */}
      </form>
    </main>
  );
}

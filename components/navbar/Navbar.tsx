"use client";
import Link from "next/link";
import { useAuth } from "../../lib/hooks/useAuth";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const { session, isAuthenticated } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4 shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          E-Commerce
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/cart" className="hover:text-gray-300">
            Cart
          </Link>
          {isAuthenticated ? (
            <button onClick={() => signOut()} className="hover:text-gray-300">
              {session?.user?.name
                ? `Log Out (${session?.user?.name})`
                : "Log Out"}
            </button>
          ) : (
            <>
              <Link href="/auth/signin" className="hover:text-gray-300">
                Sign In
              </Link>
              <Link href="/auth/signup" className="hover:text-gray-300">
                Sign Up
              </Link>
            </>
          )}
          <Link
            href="/admin"
            className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

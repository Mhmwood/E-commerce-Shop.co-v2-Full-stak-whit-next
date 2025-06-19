"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-red-600">
          Authentication Error
        </h1>
        <p>{error || "An unknown error occurred."}</p>
        <a href="/auth/signin" className="text-blue-600 underline">
          Go back to sign in
        </a>
      </div>
    </div>
  );
}

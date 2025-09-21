"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SuccessPage() {
  useEffect(() => {
    const checkCart = async () => {
      try {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/cart`);
        if (!res.ok) throw new Error("Failed to fetch cart");

        const cartItems = await res.json();

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
          localStorage.removeItem("cart");
        }
      } catch (error) {
        console.error("Cart fetch error:", error);
      }
    };

    checkCart();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="max-w-md bg-white p-8 rounded-2xl shadow-lg text-center">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-semibold mb-2">Payment Successful</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! We’ve sent a confirmation email.
        </p>
        <Link
          href="/"
          className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

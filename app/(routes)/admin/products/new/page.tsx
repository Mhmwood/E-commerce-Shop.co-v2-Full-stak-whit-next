"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../ProductForm";
import { ProductInput } from "@/validations/productSchema";

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ProductInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to create product");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="dark bg-gray-900 min-h-screen text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
      <div className="max-w-4xl mx-auto bg-gray-800 rounded p-6 shadow">
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </main>
  );
}

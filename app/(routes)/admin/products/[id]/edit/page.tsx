"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ProductForm from "../../ProductForm";
import { ProductInput } from "@/validations/productSchema";
import { Product } from "@prisma/client";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(id)) {
      setError("Invalid product ID");
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        setError("Failed to fetch product");
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (data: ProductInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to update product");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !product) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <main className="dark bg-gray-900 min-h-screen text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <div className="max-w-4xl mx-auto bg-gray-800 rounded p-6 shadow">
        <ProductForm
          onSubmit={handleSubmit}
          product={product}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}

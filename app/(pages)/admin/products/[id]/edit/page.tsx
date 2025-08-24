"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ProductForm from "../../ProductForm";
import { ProductInput } from "@/validations/productSchema";
import { Product } from "@prisma/client";
import { Button } from "@/components/ui";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  if (isLoading && !product)
    return (
      <main className="py-10 md:py-20 px-4 md:px-20 mt-10 text-primary">
        <div className="flex justify-center py-20">Loading...</div>
      </main>
    );
  if (error)
    return (
      <main className="py-10 md:py-20 px-4 md:px-20 mt-10 text-primary">
        <div className="flex justify-center py-20 text-red-500">{error}</div>
      </main>
    );
  if (!product)
    return (
      <main className="py-10 md:py-20 px-4 md:px-20 mt-10 text-primary">
        <div className="flex justify-center py-20 text-muted-foreground">
          Product not found.
        </div>
      </main>
    );

  return (
    <main className="py-10 md:py-20 px-4 md:px-20 mt-10 space-y-8 text-primary">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Edit Product</h1>
        <Link href="/admin/products">
          <button className="rounded-full px-6 py-3 border cursor-pointer border-gray-700  hover:bg-primary hover:text-white transition-all duration-300">
            Back to Products
          </button>
        </Link>
      </div>
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl bg-background border border-gray-700 shadow-lg p-8">
          <ProductForm
            onSubmit={handleSubmit}
            product={product}
            isLoading={isLoading}
            isEdit={true}
          />
        </div>
      </div>
    </main>
  );
}

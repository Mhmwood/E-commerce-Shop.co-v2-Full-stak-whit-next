"use client";

import { Product } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import Link from "next/link";
import ShowLoader from "@/components/ui/Loaders/ShowLoader";
import { CircleArrowLeft, CircleChevronLeft } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    console.log(res);
    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <main className="py-10 md:py-20 px-4 md:px-20 mt-10 space-y-8 text-primary">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Manage Products
        </h1>
        <div className="flex space-x-2">
          <Link href="/admin">
            <button className="rounded-full p-1  cursor-pointer border border-gray-700  hover:bg-primary hover:text-white transition-all duration-300">
              <CircleArrowLeft className="size-10" strokeWidth={1.75}  />
              
            </button>
          </Link>
          <Link href="/admin/products/new">
            <button className="rounded-full px-6 py-3 border cursor-pointer border-gray-700  hover:bg-primary hover:text-white transition-all duration-300">
              Create New Product
            </button>
          </Link>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl bg-background border border-gray-700 shadow-lg p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <ShowLoader />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row items-center gap-6 border-b border-gray-700 pb-6 last:border-b-0 last:pb-0"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-xl border"
                  />
                  <div className="flex-1 w-full">
                    <div className="font-semibold text-lg">{product.title}</div>
                    <div className="text-sm text-muted-foreground">
                      ${product.price} 2 {product.category}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button variant="outline">Edit</Button>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

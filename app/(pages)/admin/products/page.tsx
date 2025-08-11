"use client";

import { Product } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import Link from "next/link";
import ShowLoader from "@/components/ui/Loaders/ShowLoader";
import { CircleArrowLeft } from "lucide-react";
import Image from "next/image";

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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    console.log(res);
    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <main className="py-8 md:py-16 px-2 sm:px-4 md:px-10 lg:px-20 mt-6 space-y-8 text-primary min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center md:text-left w-full md:w-auto">
          Manage Products
        </h1>
        <div className="flex space-x-2 w-full md:w-auto justify-center md:justify-end">
          <Link href="/admin">
            <button className="rounded-full p-1 cursor-pointer border border-gray-700 hover:bg-primary hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40">
              <CircleArrowLeft
                className="size-8 sm:size-10"
                strokeWidth={1.75}
              />
            </button>
          </Link>
          <Link href="/admin/products/new">
            <button className="rounded-full px-4 sm:px-6 py-2 sm:py-3 border cursor-pointer border-gray-700 hover:bg-primary hover:text-white transition-all duration-300 font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/40">
              Create New Product
            </button>
          </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto w-full">
        <div className="rounded-2xl bg-background border border-gray-700 shadow-lg p-4 sm:p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <ShowLoader />
              <span className="text-muted-foreground text-sm">
                Loading products...
              </span>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <span className="text-center text-muted-foreground text-lg font-medium">
                No products found.
              </span>
              <Link href="/admin/products/new">
                <Button className="mt-2">Add your first product</Button>
              </Link>
            </div>
          ) : (
            // Mobile: Card grid, Desktop/Tablet: Old flex-row list
            <React.Fragment>
              {/* Mobile grid (below md) */}
              <div className="grid grid-cols-2 gap-6 md:hidden">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col items-center bg-secondary/60 border border-gray-700 rounded-2xl shadow p-4 gap-4 hover:shadow-xl transition-all duration-200"
                  >
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      className="object-cover rounded-xl border w-full h-40"
                      width={300}
                      height={176}
                    />
                    <div className="w-full flex flex-col items-center text-center">
                      <div className="font-semibold text-lg line-clamp-2 mb-1">
                        {product.title}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        <span className="font-bold text-primary">
                          ${product.price}
                        </span>{" "}
                        &middot; {product.category}
                      </div>
                    </div>
                    <div className="flex gap-2 w-full justify-center mt-auto">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="w-1/2"
                      >
                        <Button variant="outline" className="w-full">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        className="w-1/2"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop/Tablet list (md and up) */}
              <div className="hidden md:grid md:grid-cols-1 md:gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-row items-center gap-6 border-b border-gray-700 pb-6 last:border-b-0 last:pb-0"
                  >
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      className="object-cover rounded-xl border"
                      width={80}
                      height={80}
                    />
                    <div className="flex-1 w-full">
                      <div className="font-semibold text-lg">
                        {product.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${product.price} &middot; {product.category}
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
            </React.Fragment>
          )}
        </div>
      </div>
    </main>
  );
}

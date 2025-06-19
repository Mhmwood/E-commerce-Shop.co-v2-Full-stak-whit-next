"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import UploadTryar from "@/components/upload/uploadtryar";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    let url = "/api/products";
    if (selectedCategory)
      url += `?category=${encodeURIComponent(selectedCategory)}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, [selectedCategory]);

  return (
    <main className="dark bg-gray-900 min-h-screen text-white p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="mb-4">
        <label>Filter by category: </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-black"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="block"
          >
            <div className="bg-gray-800 rounded p-4 shadow hover:bg-gray-700 transition-colors">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-sm text-gray-300">{product.description}</p>
              <div className="mt-2 font-bold">${product.price}</div>
            </div>
          </Link>
        ))}
      </div> */}
      <UploadTryar />
    </main>
  );
}

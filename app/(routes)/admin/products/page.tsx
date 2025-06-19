"use client";
import { useEffect, useState } from "react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <main className="dark bg-gray-900 min-h-screen text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
      <div className="max-w-4xl mx-auto bg-gray-800 rounded p-6 shadow">
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 border-b border-gray-700 pb-4"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-semibold">{product.title}</div>
                <div className="text-sm text-gray-300">
                  ${product.price} • {product.category}
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={`/admin/products/${product.id}/edit`}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                >
                  Edit
                </a>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

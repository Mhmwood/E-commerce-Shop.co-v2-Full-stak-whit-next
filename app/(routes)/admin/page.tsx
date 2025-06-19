"use client";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState({
    productCount: 0,
    userCount: 0,
    reviewCount: 0,
  });

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then(setAnalytics)
      .catch(() => {
        // Demo data if API fails
        setAnalytics({
          productCount: 20,
          userCount: 5,
          reviewCount: 15,
        });
      });
  }, []);

  return (
    <main className="dark bg-gray-900 min-h-screen text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Products</h2>
          <div className="text-3xl font-bold text-indigo-400">
            {analytics.productCount}
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Users</h2>
          <div className="text-3xl font-bold text-green-400">
            {analytics.userCount}
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Reviews</h2>
          <div className="text-3xl font-bold text-yellow-400">
            {analytics.reviewCount}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/admin/products"
          className="bg-gray-800 p-6 rounded shadow hover:bg-gray-700"
        >
          <h2 className="text-lg font-semibold mb-2">Manage Products</h2>
          <p className="text-gray-300">Add, edit, or delete products</p>
        </a>
        <a
          href="/admin/categories"
          className="bg-gray-800 p-6 rounded shadow hover:bg-gray-700"
        >
          <h2 className="text-lg font-semibold mb-2">Manage Categories</h2>
          <p className="text-gray-300">Rename or delete categories</p>
        </a>
        <a
          href="/admin/users"
          className="bg-gray-800 p-6 rounded shadow hover:bg-gray-700"
        >
          <h2 className="text-lg font-semibold mb-2">Manage Users</h2>
          <p className="text-gray-300">View and manage user accounts</p>
        </a>
        <a
          href="/admin/reviews"
          className="bg-gray-800 p-6 rounded shadow hover:bg-gray-700"
        >
          <h2 className="text-lg font-semibold mb-2">Manage Reviews</h2>
          <p className="text-gray-300">View and delete reviews</p>
        </a>
      </div>
    </main>
  );
}

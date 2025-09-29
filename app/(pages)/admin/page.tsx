"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ShowLoader from "@components/ui/Loaders/ShowLoader";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState({
    productCount: 0,
    userCount: 0,
    reviewCount: 0,
  });

  const { data, isPending } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await fetch(
        `/api/admin/analytics`
      );
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  });

  useEffect(() => {
    if (data) {
      setAnalytics({
        productCount: data.productCount ?? 0,
        userCount: data.userCount ?? 0,
        reviewCount: data.reviewCount ?? 0,
      });
    }
  }, [data]);

  return (
    <main className="py-10 md:py-20 px-4 md:px-20 mt-10 space-y-8 text-primary">
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="rounded-2xl bg-background border border-gray-700 shadow-lg p-8 flex flex-col items-center">
          <span className="text-muted-foreground text-sm mb-2">Products</span>
          <span className="text-4xl font-bold">
            {isPending ? <ShowLoader /> : analytics.productCount}
          </span>
        </div>
        <div className="rounded-2xl bg-background border border-gray-700 shadow-lg p-8 flex flex-col items-center">
          <span className="text-muted-foreground text-sm mb-2">Users</span>
          <span className="text-4xl font-bold">
            {isPending ? <ShowLoader /> : analytics.userCount}
          </span>
        </div>
        <div className="rounded-2xl bg-background border border-gray-700 shadow-lg p-8 flex flex-col items-center">
          <span className="text-muted-foreground text-sm mb-2">Reviews</span>
          <span className="text-4xl font-bold">
            {isPending ? <ShowLoader /> : analytics.reviewCount}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/products" className="block">
          <div className="rounded-2xl bg-background border  shadow-lg p-6  flex flex-col gap-2 h-full">
            <h2 className="text-lg font-semibold mb-1">Manage Products</h2>
            <p className="text-muted-foreground">
              Add, edit, or delete products
            </p>
            <button className="w-auto rounded-full mt-4 py-3 px-4 border cursor-pointer border-gray-700  hover:bg-primary hover:text-white transition-all duration-300">
              Go to Products
            </button>
          </div>
        </Link>
        <Link href="/admin/users" className="block">
          <div className="rounded-2xl bg-background border shadow-lg p-6 flex flex-col gap-2 h-full">
            <h2 className="text-lg font-semibold mb-1">Manage Users</h2>
            <p className="text-muted-foreground">
              View and manage user accounts
            </p>
            <button className="w-auto rounded-full mt-4 py-3 px-4 border cursor-pointer border-gray-700  hover:bg-primary hover:text-white transition-all duration-300">
              Go to Users
            </button>
          </div>
        </Link>
        <Link href="/admin/reviews" className="block">
          <div className="rounded-2xl bg-background border shadow-lg p-6 flex flex-col gap-2 h-full">
            <h2 className="text-lg font-semibold mb-1">Manage Reviews</h2>
            <p className="text-muted-foreground">View and delete reviews</p>
            <button className="w-auto rounded-full mt-4 py-3 px-4 border cursor-pointer border-gray-700  hover:bg-primary hover:text-white transition-all duration-300">
              Go to Reviews
            </button>
          </div>
        </Link>
      </div>
    </main>
  );
}

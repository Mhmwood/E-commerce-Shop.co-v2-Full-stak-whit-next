"use client";

import { ProductReview } from "@prisma/client";
import { CircleArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import PaginationCustom from "@/components/shadcn-components/PaginationCustom";

// Define Review interface

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch reviews from API with sort parameter, wrapped in useCallback to avoid dependency warnings
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch reviews based on current sort order and sort direction
      const limit = 10;
      const res = await fetch(
        `/api/admin/reviews?sortBy=${sortBy}&sortOrder=${sortOrder}&limit=${limit}&page=${page}`
      );

      if (!res.ok) throw new Error("Error fetching reviews");

      const data = await res.json();
      // Prefer `data.pagination`, fallback to `totalCount` if present
      const reviewsData = data?.data ?? [];
      const pagination =
        data?.pagination ??
        (typeof data?.totalCount === "number"
          ? { page, totalPages: Math.max(1, Math.ceil(data.totalCount / limit)), totalCount: data.totalCount }
          : null);

      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      if (pagination) setTotalPages(pagination.totalPages || 1);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Delete review function
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");
      // Remove deleted review from state
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Error deleting review");
      }
    }
  };

  return (
    <main className="min-h-screen bg-background text-primary py-10 md:py-20 px-4 md:px-20 mt-10 space-y-8 flex flex-col items-center">
      <div className="max-w-4xl w-full mx-auto rounded-2xl border border-gray-700 bg-background/80 shadow-lg p-6 md:p-10">
        <div className="flex flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center md:text-left w-full md:w-auto">
            Manage Reviews
          </h2>

          <Link href="/admin">
            <button className="rounded-full p-1 cursor-pointer border border-gray-700 hover:bg-primary hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40">
              <CircleArrowLeft
                className="size-8 sm:size-10"
                strokeWidth={1.75}
              />
            </button>
          </Link>
        </div>

        {/* Sorting Controls */}
        <div className="mb-4 flex items-center space-x-2">
          <label htmlFor="sort" className="mr-2">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-full px-2 cursor-pointer border border-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="date" className="hover:bg-primary">Date</option>
            <option value="rating">Rating</option>
            <option value="reviewerName">Reviewer Name</option>
          </select>
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="rounded-full px-2 cursor-pointer border border-gray-700 hover:bg-primary hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {sortOrder === "asc" ? "Sort: Ascending" : "Sort: Descending"}
          </button>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div>Loading reviews...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No reviews found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="mb-2 flex justify-between items-center">
                  <div>
                    <strong>{review.reviewerName}</strong>
                    <span className="ml-2 text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="font-medium">Rating:</span> {review.rating}
                </div>
                <p className="mb-4 text-gray-700">{review.comment}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <PaginationCustom
            totalPages={totalPages}
            currentPage={page}
            setCurrentPage={handlePageChange}
          />
        </div>
      </div>
    </main>
  );
}

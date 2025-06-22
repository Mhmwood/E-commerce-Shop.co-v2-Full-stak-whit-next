"use client";

import { ProductReview } from "@prisma/client";
import { useEffect, useState } from "react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data.data || []));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if (res.ok) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  return (
    <main className="dark bg-gray-900 min-h-screen text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Reviews</h1>
      <div className="max-w-4xl mx-auto bg-gray-800 rounded p-6 shadow">
        <div className="grid grid-cols-1 gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-700 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">
                  {review.reviewerName || "User"}
                </div>
                <div className="text-yellow-400">Rating: {review.rating}</div>
              </div>
              <div className="text-gray-300 mb-2">{review.comment}</div>
              <div className="text-sm text-gray-400 mb-2">
                Product: {review.productId || "Unknown"}
              </div>
              <button
                onClick={() => handleDelete(review.id)}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

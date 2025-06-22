"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Product, ProductReview } from "@prisma/client";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";

type ProductWithReviews = Product & {
  reviews: (ProductReview & {
    user: {
      id: string;
      name: string;
      email: string;
    } | null;
  })[];
};

export default function ProductDetailsPage() {
  const { id } = useParams();

  const { session, isAdmin } = useAuth();

  const [product, setProduct] = useState<ProductWithReviews | null>(null);
  const [reviews, setReviews] = useState<ProductWithReviews["reviews"]>([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await res.json();
        setProduct(data);
        setReviews(data.reviews || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      // TODO: Implement actual cart API endpoint
      // For now, we'll just show a success message
      alert("Added to cart! (Cart functionality coming soon)");
    } catch (err) {
      setError("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewText.trim()) {
      setError("Please write a review comment");
      return;
    }

    try {
      setIsSubmittingReview(true);
      setError(null);
      let res;
      if (editingReviewId) {
        // PATCH request to update review
        res = await fetch(`/api/reviews/${editingReviewId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating,
            comment: reviewText.trim(),
            reviewerName: session?.user?.name,
            userId: session?.user?.id,
            productId: product?.id,
          }),
        });
      } else {
        // POST request to create review
        res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: Number(id),
            rating,
            comment: reviewText.trim(),
            userId: session?.user?.id,
            reviewerName: session?.user?.name,
          }),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit review");
      }
      const updatedReview = await res.json();
      if (editingReviewId) {
        // Update review in state
        setReviews((prev) =>
          prev.map((r) =>
            r.id === editingReviewId ? { ...r, ...updatedReview } : r
          )
        );
        setEditingReviewId(null);
      } else {
        // Add new review
        setReviews((prev) => [...prev, updatedReview]);
      }
      setReviewText("");
      setRating(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleEditReview = (review: ProductWithReviews["reviews"][number]) => {
    setReviewText(review.comment);
    setRating(review.rating);
    setEditingReviewId(review.id);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setReviewText("");
    setRating(5);
    setError(null);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete review");
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      if (editingReviewId === reviewId) handleCancelEdit();
    } catch (err) {
      setError("Failed to delete review");
    }
  };

  if (isLoading) {
    return (
      <main className="dark bg-gray-900 min-h-screen text-white p-4">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded p-6 shadow">
          <div className="text-center">Loading...</div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="dark bg-gray-900 min-h-screen text-white p-4">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded p-6 shadow">
          <div className="text-center text-red-400">
            {error || "Product not found"}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dark bg-gray-900 min-h-screen text-white p-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded p-6 shadow">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-64 h-64 object-cover rounded"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
            <div className="mb-2 text-lg font-semibold">${product.price}bv</div>
            <p className="mb-4 text-gray-300">{product.description}</p>
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold"
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Reviews ({reviews.length})</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900 text-red-200 rounded">
              {error}
            </div>
          )}

          <ul className="mb-6 space-y-4">
            {reviews.length === 0 ? (
              <li className="text-gray-400 text-center py-4">
                No reviews yet.
              </li>
            ) : (
              reviews.map((review) => (
                <li key={review.id} className="border-b border-gray-700 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold">
                      {review.reviewerName || review.user?.name || "Anonymous"}
                    </div>
                    <div className="text-yellow-400">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                  <div className="text-gray-300">{review.comment}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                  {/* Edit/Delete buttons for user's own review */}
                  {(review.userId === session?.user?.id || isAdmin) && (
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditReview(review)}
                        disabled={review.userId !== session?.user?.id}
                        className={cn(
                          "hover:underline",
                          review.userId !== session?.user?.id
                            ? "text-red-400 cursor-not-allowed"
                            : "text-blue-400"
                        )}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>

          <form
            onSubmit={handleReviewSubmit}
            className="bg-gray-700 p-4 rounded"
          >
            <h3 className="text-lg font-semibold mb-3">
              {editingReviewId ? "Edit Review" : "Write a Review"}
            </h3>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="bg-gray-600 text-white rounded px-3 py-1"
                disabled={isSubmittingReview}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "star" : "stars"}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Comment:</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this product..."
                className="w-full bg-gray-600 text-white rounded p-2"
                rows={3}
                required
                disabled={isSubmittingReview}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmittingReview || !reviewText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold"
              >
                {isSubmittingReview
                  ? editingReviewId
                    ? "Saving..."
                    : "Submitting..."
                  : editingReviewId
                  ? "Save Changes"
                  : "Submit Review"}
              </button>
              {editingReviewId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded font-bold"
                  disabled={isSubmittingReview}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

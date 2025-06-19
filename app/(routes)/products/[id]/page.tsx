"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then(setProduct);
    fetch(`/api/reviews?productId=${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data.data || []));
  }, [id]);

  const handleAddToCart = () => {
    // TODO: Implement cart logic
    alert("Added to cart!");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add auth/user info
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: Number(id),
        userId: "demo-user-id", // Replace with real user
        rating,
        comment: reviewText,
      }),
    });
    if (res.ok) {
      setReviewText("");
      setRating(5);
      fetch(`/api/reviews?productId=${id}`)
        .then((res) => res.json())
        .then((data) => setReviews(data.data || []));
    }
  };

  if (!product) return <div className="p-8 text-center">Loading...</div>;

  return (
    <main className="dark bg-gray-900 min-h-screen text-white p-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded p-6 shadow">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-64 h-64 object-cover rounded"
          />
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
            <div className="mb-2 text-lg font-semibold">${product.price}</div>
            <p className="mb-4 text-gray-300">{product.description}</p>
            <button
              onClick={handleAddToCart}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded font-bold"
            >
              Add to Cart
            </button>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Reviews</h2>
          <ul className="mb-4">
            {reviews.length === 0 && (
              <li className="text-gray-400">No reviews yet.</li>
            )}
            {reviews.map((review) => (
              <li
                key={review.id}
                className="mb-2 border-b border-gray-700 pb-2"
              >
                <div className="font-semibold">
                  {review.reviewerName || review.user?.name || "User"}
                </div>
                <div className="text-yellow-400">Rating: {review.rating}</div>
                <div className="text-gray-300">{review.comment}</div>
              </li>
            ))}
          </ul>
          <form
            onSubmit={handleReviewSubmit}
            className="bg-gray-700 p-4 rounded"
          >
            <div className="mb-2">
              <label>Rating: </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="text-black"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write a review..."
              className="w-full mb-2"
              rows={3}
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded font-bold"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

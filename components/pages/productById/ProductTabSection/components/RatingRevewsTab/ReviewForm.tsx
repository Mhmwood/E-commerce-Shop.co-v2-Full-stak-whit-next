import { StarsRating } from "@components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const ReviewForm = ({
  productId,
  userId,
  name,
  data,
  mode = "create",
  reviewId,
  onSuccess,
  onCancel,
}: {
  productId: string;
  userId: string;
  name?: string;
  data?: {
    rating: number;
    comment: string;
    reviewerName: string;
    productId: string;
    userId: string;
  };
  mode?: "create" | "update";
  reviewId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(data?.rating || 5);
  const [comment, setComment] = useState(data?.comment || "");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === "update" && reviewId) {
        const res = await fetch(
          `${process.env.NEXTAUTH_URL}/api/reviews/${reviewId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rating,
              comment,
              reviewerName: name,
              productId,
              userId,
            }),
          }
        );
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update review");
        }
        return res.json();
      } else {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating,
            comment,
            reviewerName: name,
            productId,
            userId,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to submit review");
        }
        return res.json();
      }
    },
    onSuccess: () => {
      setSuccess(mode === "update" ? "Review updated!" : "Review submitted!");
      setError(null);
      if (mode === "create") {
        setRating(5);
        setComment("");
      }
      queryClient.invalidateQueries();
      if (onSuccess) onSuccess();
    },
    onError: (err: unknown) => {
      let message =
        mode === "update"
          ? "Failed to update review"
          : "Failed to submit review";
      if (err instanceof Error) message = err.message;
      setError(message);
      setSuccess(null);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        mutation.mutate();
      }}
      className="space-y-3"
    >
      <div>
        <label className="block text-sm font-medium">Rating</label>
        <StarsRating rating={rating} onChange={setRating} showNumber />
      </div>

      <div>
        <label className="block text-sm font-medium">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded px-2 py-1"
          minLength={4}
          maxLength={200}
          required
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={mutation.status === "pending"}
        >
          {mutation.status === "pending"
            ? mode === "update"
              ? "Updating..."
              : "Submitting..."
            : mode === "update"
            ? "Update Review"
            : "Submit Review"}
        </button>
        {mode === "update" && onCancel && (
          <button
            type="button"
            className="bg-gray-300 text-black px-4 py-2 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

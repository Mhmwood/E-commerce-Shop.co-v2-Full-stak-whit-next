import { forwardRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

import CardCustomersReviews from "./CardCustomersReviews";
import { ProductReview } from "@prisma/client";

interface CustomersReviewsListProps {
  reviews?: ProductReview[] | undefined;
  className?: string;
  grid?: boolean;
  sortOrder?: "asc" | "desc";
  currentUserId?: string;
}

const CustomersReviewsList = forwardRef<
  HTMLDivElement,
  CustomersReviewsListProps
>(function CustomersReviewsList(
  { reviews, className, grid = false, sortOrder = "desc", currentUserId },
  ref
) {
  const [marginX, setMarginX] = useState(80);
  const [sortedReviews, setSortedReviews] = useState<
    ProductReview[] | undefined
  >(reviews);

  useEffect(() => {
    const handleScroll = () => {
      if (ref && typeof ref !== "function" && ref.current) {
        setMarginX(ref.current.scrollLeft > 50 ? 0 : 80);
      }
    };

    let scrollElement: HTMLDivElement | null = null;
    if (ref && typeof ref !== "function") {
      scrollElement = ref.current;
    }

    if (scrollElement && !grid) {
      scrollElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollElement && !grid) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [ref, grid]);

  useEffect(() => {
    if (reviews) {
      const sorted = [...reviews].sort((a, b) =>
        sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating
      );
      setSortedReviews(sorted);
    }
  }, [reviews, sortOrder]);

  return (
    <div
      className={`w-full transition duration-300 ${className ?? ""} ${
        grid
          ? "overflow-hidden"
          : "overflow-x-scroll no-scrollbar scroll-smooth"
      }`}
      ref={ref}
    >
      <motion.ul
        className={
          grid ? "grid gap-5 md:grid-cols-2 lg:grid-cols-3" : "flex gap-5"
        }
        animate={{ marginLeft: grid ? 0 : marginX }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {sortedReviews?.map((review, index) => (
          <li key={index}>
            <CardCustomersReviews
              id={review.id}
              rating={review.rating}
              reviewerName={review.reviewerName}
              comment={review.comment}
              userId={review.userId}
              productId={review.productId}
              date={review.date}
              currentUserId={currentUserId}
            />
          </li>
        ))}
      </motion.ul>
    </div>
  );
});

export default CustomersReviewsList;

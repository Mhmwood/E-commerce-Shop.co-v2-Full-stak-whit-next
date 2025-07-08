import CustomersReviewsList from "@/components/Users/CustomersReviewsList";
import { ProductReview } from "@prisma/client";
import { useAuth } from "@/hooks/useAuth";
import { ReviewForm } from "./ReviewForm";


interface RatingReviewTabsProps {
  reviews: ProductReview[];
  productId: string;
}

const RatingReviewTabs = ({ reviews, productId }: RatingReviewTabsProps) => {
  const { session } = useAuth();
  const currentUserId = session?.user?.id;
  const userName = session?.user?.name;

  const hasReviewed = reviews.some((r) => r.userId === currentUserId);
  return (
    <div className="space-y-10">
      <h3 className="mb-3 text-2xl font-bold md:col-span-2 lg:col-span-3 mr-5">
        All Reviews
        <span className=" font-normal text-black/60">({reviews.length})</span>
      </h3>
      {!hasReviewed && currentUserId && userName && (
        <div className="mb-6">
          <div className="p-4 border rounded-xl bg-gray-50">
            <h4 className="font-semibold mb-2">Write a Review</h4>
            <ReviewForm
              productId={productId}
              userId={currentUserId}
              name={userName}
            />
          </div>
        </div>
      )}
      <CustomersReviewsList
        reviews={reviews}
        sortOrder="desc"
        grid={true}
        currentUserId={currentUserId}
      />
    </div>
  );
};



export default RatingReviewTabs;
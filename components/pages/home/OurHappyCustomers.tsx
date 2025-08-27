"use client";
import ScrollButtons from "@/components/ui/ScrollButtons";
import CustomersReviewsList from "@/components/Users/CustomersReviewsList";
import { ProductReview } from "@prisma/client";

import { useEffect, useRef, useState } from "react";

const OurHappyCustomers = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [reviews, setReviews] = useState<ProductReview[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  
  // const reviews = fetch("/api/reviews?limit=10&sortBy=rating&order=desc").then(
  //   async (res) => {
  //     const data = await res.json();
  //     console.log();
  //     return data;
  //   }
  // );

  return (
    <section className="  py-10 md:py-20    ">
      <div>
        <div className="flex justify-between  mb-16 px-4 md:px-20">
          <h2 className="text-4xl font-extrabold font-integral">
            OUR HAPPY CUSTOMERS
          </h2>

          <ScrollButtons targetRef={scrollContainerRef} />
        </div>

        <div className="relative">
          <div className=" absolute backdrop-blur-sm   w-4 md:w-20 h-full"></div>
          <div className=" absolute backdrop-blur-sm right-0  w-4 md:w-20 h-full"></div>

          {reviews && (
            <CustomersReviewsList ref={scrollContainerRef} reviews={reviews} />
          )}
        </div>
      </div>
    </section>
  );
};

export default OurHappyCustomers;

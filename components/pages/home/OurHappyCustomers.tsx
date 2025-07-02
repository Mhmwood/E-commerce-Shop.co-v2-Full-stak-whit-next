"use client";
import ScrollButtons from "@/components/ui/ScrollButtons";
import CustomersReviewsList from "@/components/Users/CustomersReviewsList";
// import { useProducts } from "@/hooks/use-products";
// import { Product } from "@/types/products";

import { useRef } from "react";

const OurHappyCustomers = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // const { products } = useProducts({
  //   sortBy: "rating",
  //   order: "desc",
  //   limit: 20,
  //   select: ["reviews"],
  // });

  return (
    <section className="  py-10 md:py-20    ">
      <div>
        <div className="flex justify-between  mb-16 px-4 md:px-20">
          <h2 className="text-4xl font-extrabold font-integral">
            OUR HAPPY CUSTOMERS
          </h2>

          {/* <ScrollButtons targetRef={scrollContainerRef} /> */}
        </div>

        <div className="relative">
          <div className=" absolute backdrop-blur-sm   w-4 md:w-20 h-full"></div>
          <div className=" absolute backdrop-blur-sm right-0  w-4 md:w-20 h-full"></div>

          {/* <CustomersReviewsList
            ref={scrollContainerRef}
            reviews={products
              .map((product: Product) =>
                product.reviews.filter((review) => review.rating > 4)
              )
              .flat()}
          /> */}
        </div>
      </div>
    </section>
  );
};

export default OurHappyCustomers;

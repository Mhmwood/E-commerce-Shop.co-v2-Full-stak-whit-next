"use client";

import { useProducts } from "@/hooks/useProducts";
import ProductList from "./ProductList";

import ShowLoader from "../ui/Loaders/ShowLoader";
import ShowError from "../ui/errs/ShowError";
import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";


interface ProductSectionProps {
  title: string;
  category?: string;
  sortBy?: keyof Product;
  order?: "asc" | "desc";
  limit?: number;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  category,
  sortBy,
  order,
  limit = 10,
}) => {

  const { data, isLoading, isError, error } = useProducts({
    category: category || undefined,
    sortBy,
    order,
    limit,
  });

  const router = useRouter();

  return (
    <section className="py-10 md:py-20 transition-all duration-300">
      <div className="flex flex-col items-center justify-center space-y-14">
        {isLoading ? (
          <ShowLoader />
        ) : isError ? (
          <div className="">
            <ShowError errorMsg={error.message} />
          </div>
        ) : (
          <>
            <h2 className="text-4xl font-extrabold font-integral">{title}</h2>
            <ProductList products={data.products} />
            <div className="flex space-x-4">
              <button
                onClick={() =>
                  router.push(
                    `/shop/?category=${
                      category ? encodeURIComponent(category) : ""
                    }&sortBy=${sortBy}&order=${order}`
                  )
                }
                className="w-auto rounded-full py-4 px-8 border-2 hover:bg-primary hover:text-white transition-all duration-300"
              >
                Show All
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductSection;

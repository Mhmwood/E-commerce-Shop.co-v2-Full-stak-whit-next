"use client";

import { BreadcrumbBar } from "@/components/shadcn";
import ShowLoader from "@/components/ui/Loaders/ShowLoader";
import { useProductById } from "@/hooks/useProducts";
import ImageDisplay from "./ImageDisplay";
import InfoDisplay from "./InfoDisplay";
import ProductTabSection from "./ProductTabSection";
import { ProductSection } from "@/components/products";

const ProductClientView = ({ id }: { id: string }) => {
  const { data: product, isPending } = useProductById(id);

  if (isPending) {
    return (
      <div className="min-h-lvh flex justify-center items-center">
        <ShowLoader />
      </div>
    );
  }
  return (
    <div className="py-10 md:py-20 px-4 md:px-20 mt-7">
      <div className="mt-6 mb-9">
        <BreadcrumbBar link={`${product?.category}`} name={product.title} />
      </div>
      <section className="grid gap-x-6 max-lg:gap-y-5 lg:grid-cols-[30.125rem_1fr] xl:grid-cols-[38.125rem_1fr]">
        <ImageDisplay images={product?.images || []} />
        <InfoDisplay product={product} />
      </section>
      <section>
        <ProductTabSection product={product} />
      </section>
      <section className="mt-12">
        <ProductSection
          title="You might also like"
          limit={5}
          category={product?.category}
          sortBy="rating"
          order="desc"
        />
      </section>
    </div>
  );
};
export default ProductClientView;

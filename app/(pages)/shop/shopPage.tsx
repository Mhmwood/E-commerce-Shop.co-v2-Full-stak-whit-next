
"use client";
import FliterMenu from "@/components/pages/shop/FliterMenu";
import { useSearchParams } from "next/navigation";
import ShowProduct from "@/components/pages/shop/ShowProduct";
import BreadcrumbBar from "@/components/shadcn-components/BreadcrumbBar";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const sortBy =
    (searchParams.get("sortBy") as "rating" | "price") ?? undefined;
  const order = (searchParams.get("order") as "asc" | "desc") ?? undefined;

  return (
    <div className="py-10 md:py-20 px-4 md:px-20 mt-10">
      <BreadcrumbBar name={category || ""} />
      <div className="lg:grid grid-cols-12 gap-5 mt-6">
        <div className="col-span-3 hidden lg:block">
          <FliterMenu />
        </div>
        <div className="col-span-9">
          <ShowProduct category={category} sortBy={sortBy} order={order} />
        </div>
      </div>
    </div>
  );
}

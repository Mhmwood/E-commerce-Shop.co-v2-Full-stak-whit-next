// "use client";

// // import ShowProduct from "../../../components/pages/shop/ShowProduct";

// import FliterMenu from "../../../components/pages/shop/FliterMenu";
// import { useEffect, useState } from "react";
// import BreadcrumbBar from "@/components/shadcn-components/BreadcrumbBar";
// import { Product } from "@prisma/client";
// import { useSearchParams } from "next/navigation";
// import ShowProduct from "@/components/pages/shop/ShowProduct";

// const ShopPage = () => {
//   const [Product, setProduct] = useState<Product>()
//   const searchParams = useSearchParams();

//   const sortBy = searchParams.get("sortBy") as keyof Product;
//   const order = searchParams.get("order") as "asc" | "desc" | undefined;
//   const category = searchParams.get("category");

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [searchParams]);

//   return (
//     <div className="py-10 md:py-20 px-4 md:px-20 mt-10">
//       <BreadcrumbBar name={category || ""} />
//       <div className="lg:grid grid-cols-12 gap-5 mt-6 ">
//         <div className="col-span-3 hidden lg:block ">
//           <FliterMenu />
//         </div>

//         <div className="col-span-9 w-full  ">
//           <ShowProduct
//             category={category ?? undefined}
//             sortBy={sortBy}
//             order={order}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShopPage;

// app/(shop)/page.tsx (or pages/shop/index.tsx)
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

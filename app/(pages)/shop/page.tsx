import { Suspense } from "react";
import ShopPage from "../../../components/pages/shop/shopPage";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading shop...</div>}
    >
      <div className="py-10 md:py-20 px-4 md:px-20 mt-10">
        <ShopPage />
      </div>
    </Suspense>
  );
}

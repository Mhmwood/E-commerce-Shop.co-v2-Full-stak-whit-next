import { Suspense } from "react";
import ShopPage from "./shopPage";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading shop...</div>}
    >
      <ShopPage />
    </Suspense>
  );
}

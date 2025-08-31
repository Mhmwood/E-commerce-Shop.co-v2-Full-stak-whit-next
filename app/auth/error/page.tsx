import { Suspense } from "react";
import AuthErrorPage from "./errorPage";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-6 text-center">Loading error...</div>}
    >
      <AuthErrorPage />
    </Suspense>
  );
}

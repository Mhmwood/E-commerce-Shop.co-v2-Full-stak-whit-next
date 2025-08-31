import { Suspense } from "react";
import AdminUsersPage from "./UserPage";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading users...</div>}
    >
      <AdminUsersPage />
    </Suspense>
  );
}

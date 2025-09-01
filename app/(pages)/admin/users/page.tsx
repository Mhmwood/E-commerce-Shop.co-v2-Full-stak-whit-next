import { Suspense } from "react";
import AdminUsersPage from "../../../../components/pages/adminUser/UserPage";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading users...</div>}
    >
      <main className="min-h-screen bg-background text-primary py-10 md:py-20 px-4 md:px-20 mt-10 space-y-8 flex flex-col items-center">
        <AdminUsersPage />
      </main>
    </Suspense>
  );
}

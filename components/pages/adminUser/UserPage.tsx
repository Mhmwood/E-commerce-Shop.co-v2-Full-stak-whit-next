"use client";

import { useState, useEffect, useCallback } from "react";
import PaginationCustom from "@/components/shadcn-components/PaginationCustom";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { User } from "@prisma/client";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { CircleArrowLeft } from "lucide-react";

type UserWithCounts = User & {
  _count: {
    reviews: number;
    orders: number;
    cartItems: number;
  };
};

type Pagination = {
  page: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<UserWithCounts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<Pagination>({
    page: Number(searchParams.get("page")) || 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const updateURL = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pagination.page.toString());
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }
    if (roleFilter) {
      params.set("role", roleFilter);
    } else {
      params.delete("role");
    }
    router.push(`/admin/users?${params.toString()}`);
  }, [pagination.page, debouncedSearchTerm, roleFilter, router, searchParams]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: searchParams.get("page") || "1",
        search: searchParams.get("search") || "",
        role: searchParams.get("role") || "",
        limit: "10",
      });

      try {
        const res = await fetch(`/api/admin/users?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.users);
        setPagination(data.pagination);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [searchParams]);

  useEffect(() => {
    updateURL();
  }, [pagination.page, debouncedSearchTerm, roleFilter, updateURL]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm("Are you sure you want to change this user's role?")) return;

    const res = await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });

    if (res.ok) {
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, role: newRole as "USER" | "ADMIN" } : u
        )
      );
    } else {
      alert("Failed to update role");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const res = await fetch(`/api/admin/users?userId=${userId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
    } else {
      const data = await res.json();
      alert(`Failed to delete user: ${data.error}`);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="max-w-6xl w-full mx-auto rounded-2xl border border-gray-700 bg-background/80 shadow-lg p-6 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-xl font-bold text-primary">User Management</h2>
        <div className="flex space-x-2 w-full md:w-auto justify-center md:justify-end">
          <Link href="/admin">
            <button className="rounded-full p-1 cursor-pointer border border-gray-700 hover:bg-primary hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40">
              <CircleArrowLeft
                className="size-8 sm:size-10"
                strokeWidth={1.75}
              />
            </button>
          </Link>
          <Link href="/admin/users/new">
            <button className="rounded-full px-4 sm:px-6 py-2 sm:py-3 border cursor-pointer border-gray-700 hover:bg-primary hover:text-white transition-all duration-300 font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/40">
              Create New User
            </button>
          </Link>
        </div>
      </div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-secondary placeholder:text-gray-400 border border-gray-700 rounded-lg shadow-sm text-primary px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none w-full md:w-1/3"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-secondary border border-gray-700 rounded-lg shadow-sm text-primary px-4 py-2 focus:ring-2 focus:ring-primary/40 focus:outline-none w-full md:w-1/4"
        >
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      {isLoading && (
        <p className="text-center text-muted-foreground py-6">
          Loading users...
        </p>
      )}
      {error && <p className="text-red-500 text-center py-2">{error}</p>}
      <div className="overflow-x-auto rounded-lg border border-gray-700 bg-background mt-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-secondary">
              <th className="px-5 py-3 border-b border-gray-700 text-left font-semibold text-muted-foreground uppercase tracking-wider">
                User
              </th>
              <th className="px-5 py-3 border-b border-gray-700 text-left font-semibold text-muted-foreground uppercase tracking-wider">
                Role
              </th>
              <th className="px-5 py-3 border-b border-gray-700 text-left font-semibold text-muted-foreground uppercase tracking-wider">
                Stats
              </th>
              <th className="px-5 py-3 border-b border-gray-700 text-left font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-secondary/40 transition-all"
              >
                <td className="px-5 py-5 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <Image
                      className="rounded-full border"
                      src={user.image || "/defaultProfile.png"}
                      alt={user.name || "User"}
                      width={40}
                      height={40}
                    />
                    <div>
                      <div className="font-semibold text-primary">
                        {user.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-700">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="bg-secondary border border-gray-700 rounded-lg shadow-sm text-primary px-2 py-1 focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-5 py-5 border-b border-gray-700">
                  <div className="font-medium text-primary">
                    Orders: {user._count.orders}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Reviews: {user._count.reviews}
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-700">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-2.5">
        <div className=" mt-4">
          <span className="text-sm text-muted-foreground">
            Showing {users.length} of {pagination.totalCount} users
          </span>
        </div>

        <div className="">
          <PaginationCustom
            totalPages={pagination.totalPages}
            currentPage={pagination.page}
            setCurrentPage={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

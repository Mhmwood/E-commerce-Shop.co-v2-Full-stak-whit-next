"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { User } from "@prisma/client";
import Link from "next/link";
import { useDebounce } from "use-debounce";

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
    <main className="dark bg-gray-900 min-h-screen text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Link
          href="/admin/users/new"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Create User
        </Link>
      </div>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-700 p-2 rounded w-1/3"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-gray-700 p-2 rounded"
        >
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {isLoading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Stats
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                      <Image
                        className="w-full h-full rounded-full"
                        src={user.image || "/defaultProfile.png"}
                        alt={user.name || "User"}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-white whitespace-no-wrap">
                        {user.name}
                      </p>
                      <p className="text-gray-400 whitespace-no-wrap">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="bg-gray-700 text-white rounded p-1"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm">
                  <p className="text-white whitespace-no-wrap">
                    Orders: {user._count.orders}
                  </p>
                  <p className="text-gray-400 whitespace-no-wrap">
                    Reviews: {user._count.reviews}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <span className="text-sm text-gray-400">
          Showing {users.length} of {pagination.totalCount} users
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPreviousPage || isLoading}
            className="bg-gray-700 px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNextPage || isLoading}
            className="bg-gray-700 px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}

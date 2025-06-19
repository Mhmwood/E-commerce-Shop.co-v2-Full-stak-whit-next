"use client";
import { useEffect, useState } from "react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const handleRename = async (oldName) => {
    if (!newName.trim()) return;
    const res = await fetch("/api/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldName, newName: newName.trim() }),
    });
    if (res.ok) {
      setCategories(
        categories.map((cat) => (cat === oldName ? newName.trim() : cat))
      );
      setEditing(null);
      setNewName("");
    }
  };

  const handleDelete = async (name) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    const res = await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setCategories(categories.filter((cat) => cat !== name));
    }
  };

  return (
    <main className="dark bg-gray-900 min-h-screen text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      <div className="max-w-2xl mx-auto bg-gray-800 rounded p-6 shadow">
        <ul>
          {categories.map((category) => (
            <li
              key={category}
              className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2"
            >
              <span className="font-semibold">{category}</span>
              <div className="flex gap-2">
                {editing === category ? (
                  <>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="text-black px-2 py-1 rounded"
                      placeholder="New name"
                    />
                    <button
                      onClick={() => handleRename(category)}
                      className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(null);
                        setNewName("");
                      }}
                      className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditing(category);
                        setNewName(category);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function AdminCategoriesPage() {
  const utils = trpc.useContext();

  const { data: categories, isLoading } = trpc.category.getAll.useQuery();
  const createCategory = trpc.category.create.useMutation({
    onSuccess: () => utils.category.getAll.invalidate(),
  });
  const updateCategory = trpc.category.update.useMutation({
    onSuccess: () => utils.category.getAll.invalidate(),
  });
  const deleteCategory = trpc.category.delete.useMutation({
    onSuccess: () => utils.category.getAll.invalidate(),
  });

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreate = () => {
    if (newName.trim()) createCategory.mutate({ name: newName.trim() });
    setNewName("");
  };

  const handleUpdate = (id: number) => {
    if (editName.trim()) updateCategory.mutate({ id, name: editName.trim() });
    setEditingId(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

      {/* Create */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          Add
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {categories?.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between border p-3 rounded">
              {editingId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-400"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span>{cat.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditName(cat.name);
                      }}
                      className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory.mutate({ id: cat.id })}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

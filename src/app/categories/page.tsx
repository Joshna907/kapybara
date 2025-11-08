"use client";

import { trpc } from "@/lib/trpc";
import { useState } from "react";

type Category = {
  id: number;
  name: string;
};

export default function CategoriesPage() {
  const [name, setName] = useState("");
  const utils = trpc.useUtils();

  const { data: categories, isLoading } = trpc.category.getAll.useQuery<Category[]>();
  const createCategory = trpc.category.create.useMutation({
    onSuccess: () => {
      utils.category.getAll.invalidate();
      setName("");
    },
  });
  const deleteCategory = trpc.category.delete.useMutation({
    onSuccess: () => utils.category.getAll.invalidate(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) createCategory.mutate({ name });
  };

  if (isLoading) return <p>Loading categories...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Category Management</h1>

      {/* Create Category */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="border p-2 rounded flex-1"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      {/* List Categories */}
      <ul className="space-y-2 mt-4">
        {categories?.map((cat: Category) => (
          <li
            key={cat.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>{cat.name}</span>
            <button
              onClick={() => deleteCategory.mutate({ id: cat.id })}
              className="bg-red-500 px-2 py-1 text-white rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";
import { trpc } from "@/lib/trpc";

export default function CategoryFilter({ onSelect }: { onSelect: (id: number) => void }) {
  const { data: categories } = trpc.category.getAll.useQuery();

  return (
    <div className="flex gap-2">
      {categories?.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

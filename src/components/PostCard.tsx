// src/components/PostCard.tsx
"use client";

import Link from "next/link";
import React from "react";

type Category = { id: number; name: string; slug?: string };
type PostCardProps = {
  slug: string;
  title: string;
  excerpt?: string;
  image?: string | null;
  categories?: Category[];
  author?: string | null;
  date?: string | null;
};

export default function PostCard({ slug, title, excerpt, image, categories, author, date }: PostCardProps) {
  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
      <Link href={`/blog/${slug}`} className="block">
        <div className="h-44 w-full overflow-hidden bg-gray-100">
          <img
            src={image || "/images/placeholder-600x400.png"}
            alt={title}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {categories?.slice(0, 2).map((c) => (
              <span key={c.id} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                {c.name}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-2 line-clamp-3">{excerpt}</p>

          <div className="mt-4 text-gray-400 text-xs flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-200" />
            <span>{author || "Author"}</span>
            <span>•</span>
            <span>{date ? new Date(date).toLocaleDateString() : "—"}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

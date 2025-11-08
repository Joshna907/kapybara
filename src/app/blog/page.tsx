// app/blog/page.tsx
"use client";

import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { useState } from "react";

export default function BlogListPage() {
  const { data: posts, isLoading: postsLoading } = trpc.post.getAll.useQuery();
  const { data: categories } = trpc.category.getAll.useQuery();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  if (postsLoading) return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">Loading posts...</div>
    </>
  );

  // posts come with categories array (our backend returns categories for each post)
  const filtered = selectedCategory ? (posts || []).filter((p: any) => (p.categories || []).some((c: any) => c.slug === selectedCategory || c.name === selectedCategory)) : (posts || []);

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">All Blogs</h1>

          <div className="flex items-center gap-3">
            <select
              className="border rounded px-3 py-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.slug || c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length ? (
            filtered.map((post: any) => (
              <PostCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.content?.slice(0, 180) || ""}
                image={post.image || null}
                categories={post.categories}
                author={post.author || "Admin"}
                date={post.createdAt || post.created_at || null}
              />
            ))
          ) : (
            <p className="text-gray-500">No posts found.</p>
          )}
        </div>
      </main>
    </>
  );
}

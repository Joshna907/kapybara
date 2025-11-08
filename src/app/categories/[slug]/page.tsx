"use client";

import { trpc } from "@/lib/trpc";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function CategoryPostsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: posts, isLoading, error } = trpc.post.getByCategorySlug.useQuery({ slug });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
        <p className="text-gray-500">Loading posts...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );

  if (!posts || posts.length === 0)
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
        <p className="text-gray-500">No posts in this category.</p>
      </div>
    );

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="text-gray-500 hover:text-gray-700 mb-8 inline-flex items-center font-medium transition"
      >
        ← Back
      </button>

      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
        {posts[0]?.category?.name || slug}
      </h1>

      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Browse posts in &ldquo;{posts[0]?.category?.name || slug}&rdquo;.
      </p>

      {/* Posts list (stack) */}
      <div className="space-y-8">
        {posts.map((post: any) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block bg-white rounded-3xl shadow-md border border-gray-200 hover:shadow-lg transition p-6 hover:-translate-y-1 duration-300"
          >
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-60 object-cover rounded-2xl mb-4"
              />
            )}

            <p className="text-sm text-blue-600 font-medium mb-1">{post.category?.name}</p>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{post.title}</h2>

            <p className="text-gray-500 prose line-clamp-3">{post.excerpt ?? post.content ?? ""}</p>

            <div className="mt-4 text-gray-400 text-sm flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-300" />
              <span>{post.author ?? "Unknown"}</span>
              <span>•</span>
              <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Back to home */}
      <div className="mt-12 text-center">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}

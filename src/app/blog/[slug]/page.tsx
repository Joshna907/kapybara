"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { trpc } from "@/lib/trpc";

function ReadingTime({ content }: { content: string }) {
  const words = content ? content.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return <span>{minutes} min read</span>;
}

export default function SinglePostPage() {
  const { slug } = useParams();
  const router = useRouter();

  // ✅ Only trigger query when slug exists
  const { data: post, isLoading, error } = trpc.post.getBySlug.useQuery(
    { slug: slug as string },
    { enabled: !!slug }
  );

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-gray-500">Loading post…</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-red-500">Error loading post: {error.message}</p>
      </div>
    );

  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-gray-500">Post not found.</p>
      </div>
    );

  const { title, content, image, author, createdAt, categories } = post as any;

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* back */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            ← Back
          </button>
        </div>

        {/* article */}
        <article className="prose lg:prose-xl mx-auto">
          {image && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-sm">
              <img
                src={image}
                alt={title}
                className="w-full h-[420px] object-cover"
              />
            </div>
          )}

          <header className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div>
                <div className="text-sm font-medium text-gray-700">
                  {author || "Unknown"}
                </div>
                <div className="text-xs text-gray-400">
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString()
                    : "—"}{" "}
                  • <ReadingTime content={content} />
                </div>
              </div>
              <div className="ml-auto flex gap-2 items-center">
                {categories?.map((c: any) => (
                  <span
                    key={c.id}
                    className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="text-4xl font-bold leading-tight mt-4">{title}</h1>
          </header>

          <section className="mt-6">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </section>

          {/* footer */}
          <footer className="mt-12 border-t pt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <ReadingTime content={content} /> •{" "}
              {(content || "").trim().split(/\s+/).length} words
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigator.share?.({ title, text: title })}
                className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Share
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  title
                )}&url=${encodeURIComponent(location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Tweet
              </a>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}

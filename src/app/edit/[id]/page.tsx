"use client";

import { trpc } from "@/lib/trpc";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams(); // post id from URL
  const utils = trpc.useUtils();

  const { data: post, isLoading } = trpc.post.getById.useQuery({ id: id as string });
  const updatePost = trpc.post.update.useMutation({
    onSuccess: () => {
      utils.post.getAll.invalidate(); // refresh post list
      router.push("/dashboard");
    },
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Pre-fill form when post loads
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  if (isLoading) return <p>Loading post...</p>;
  if (!post) return <p>Post not found.</p>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePost.mutate({ id: post.id, title, content });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">✏️ Edit Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="w-full border p-2 rounded text-lg"
          required
        />

        <div data-color-mode="light">
          <MDEditor value={content} onChange={(v) => setContent(v || "")} />
        </div>

        <button
          type="submit"
          disabled={updatePost.isPending}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-lg"
        >
          {updatePost.isPending ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Markdown editor (to avoid SSR issues)
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("**Start writing your post here...**");

  const createPost = trpc.post.create.useMutation({
    onSuccess: () => router.push("/dashboard"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost.mutate({ title, content });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">📝 Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          className="w-full border p-2 rounded text-lg"
          required
        />

        {/* Markdown Editor */}
        <div data-color-mode="light">
          <MDEditor value={content} onChange={(value) => setContent(value || "")} />
        </div>

        <button
          type="submit"
          disabled={createPost.isPending}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
        >
          {createPost.isPending ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = trpc.post.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-muted-foreground">
        No post found 😕
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card className="border border-border/40 shadow-sm">
        <CardHeader>
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString()} •{" "}
            {post.categoryNames?.join(", ") || "Uncategorized"}
          </p>
        </CardHeader>
        <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-72 object-cover rounded-xl mb-6"
            />
          )}

          {/* Markdown rendering */}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
}

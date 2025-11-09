"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import {
  Upload,
  X,
  Loader2,
  Eye,
  Bold,
  Italic,
  Quote,
  List,
  CheckCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminPostsPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState<string>(
    "# Hello World\nWrite your post in **Markdown**..."
  );
  const [date, setDate] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // 🔧 Mutations
  const createPost = trpc.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.getAll.invalidate();
      resetForm();
      showToast();
    },
  });

  const updatePost = trpc.post.update.useMutation({
    onSuccess: async () => {
      await utils.post.getAll.invalidate();
      resetForm();
      showToast("Post Updated Successfully!");
      setEditingPost(null);
    },
  });

  const deletePost = trpc.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.getAll.invalidate();
      showToast("Post Deleted!");
    },
  });

  const { data: posts, isLoading: loadingPosts } = trpc.post.getAll.useQuery();

  const showToast = (message = "Post Published Successfully!") => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("# Hello World\nWrite your post in **Markdown**...");
    setDate("");
    setAuthor("");
    setImage(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e && e.preventDefault();
    if (!title || !content) {
      alert("Title and Content are required");
      return;
    }
    const base64Image = image ? await toBase64(image) : "";

    // ✅ Safely handle excerpt even if backend doesn't expect it
    const postData: any = {
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
      content,
      image: base64Image,
      author,
      published: true,
    };

    if (excerpt) postData.excerpt = excerpt;

    if (editingPost) {
      updatePost.mutate({ id: editingPost.id, ...postData });
    } else {
      createPost.mutate(postData);
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || "");
    setContent(post.content);
    setAuthor(post.author || "");
  };

  const dropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const drop = dropRef.current;
    if (!drop) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer?.files;
      if (files && files[0]) setImage(files[0]);
    };

    drop.addEventListener("dragover", handleDragOver);
    drop.addEventListener("dragleave", handleDragLeave);
    drop.addEventListener("drop", handleDrop);

    return () => {
      drop.removeEventListener("dragover", handleDragOver);
      drop.removeEventListener("dragleave", handleDragLeave);
      drop.removeEventListener("drop", handleDrop);
    };
  }, []);

  const insertAtCursor = (before: string, after = "") => {
    const textarea = document.getElementById(
      "content-textarea"
    ) as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newVal =
      content.slice(0, start) +
      before +
      content.slice(start, end) +
      after +
      content.slice(end);
    setContent(newVal);
    setTimeout(() => {
      textarea.focus();
      const pos =
        start + before.length + (textarea.selectionEnd - textarea.selectionStart);
      textarea.setSelectionRange(pos, pos);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 relative">
      {/*  Notification */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg z-50"
        >
          <CheckCircle className="w-5 h-5" /> Post action successful!
        </motion.div>
      )}

      {/*  Header */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => resetForm()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={createPost.isPending}>
          {createPost.isPending || updatePost.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          {editingPost ? "Update" : "Publish"}
        </Button>
      </div>

      {/*  Form */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <motion.div
          layout
          className="rounded-2xl bg-background shadow-sm border overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            <div className="lg:flex-1 p-8 lg:p-12 space-y-8">
              <div>
                <Input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  placeholder="Enter post title..."
                  className="text-3xl font-semibold border-none focus-visible:ring-0 p-0"
                />
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Slug (auto-generated)"
                  className="mt-2 text-sm text-gray-500 border-none focus-visible:ring-0 p-0"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Button variant="ghost" size="sm" onClick={() => insertAtCursor("**bold**")}>
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => insertAtCursor("*italic*")}>
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => insertAtCursor("\n\n- ")}>
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => insertAtCursor("\n\n> ")}>
                    <Quote className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  id="content-textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[360px] resize-none border-none focus-visible:ring-0 text-base leading-7"
                  placeholder="Write your story in Markdown..."
                />
              </div>
            </div>

            {/* ✅ Right Panel */}
            <div className="lg:w-1/2 lg:border-l bg-muted/10 p-8 lg:p-12 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-500 text-sm">Post Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Short summary for post list..."
                    className="bg-muted"
                  />
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  <Input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author name"
                  />

                  <div
                    ref={dropRef}
                    className={`rounded-lg border-2 p-4 text-center transition ${
                      isDragging
                        ? "border-primary bg-muted"
                        : "border-dashed border-gray-300 bg-white"
                    }`}
                  >
                    {image ? (
                      <div className="relative inline-block w-full">
                        <img
                          src={URL.createObjectURL(image)}
                          alt="preview"
                          className="h-36 w-full object-cover rounded-md"
                        />
                        <button
                          onClick={() => setImage(null)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                          type="button"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center gap-2 cursor-pointer">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Drag & drop or click to upload
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files && setImage(e.target.files[0])
                          }
                        />
                      </label>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-500 text-sm flex items-center gap-2">
                    <Eye className="h-4 w-4" /> Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {image && (
                      <img
                        src={URL.createObjectURL(image)}
                        className="w-full rounded-lg mb-6 object-cover h-64"
                      />
                    )}
                    <h1>{title || "Your Great Headline"}</h1>
                    {excerpt && <p className="text-gray-600 text-lg">{excerpt}</p>}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ✅ Posts Table */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">All Posts</h2>
          {loadingPosts ? (
            <p>Loading posts...</p>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Author</th>
                  <th className="p-2 text-left">Published</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Dummy Post */}
                <tr className="border-b">
                  <td className="p-2">Secrets to Successful Remote Work</td>
                  <td className="p-2">Tom Hardy</td>
                  <td className="p-2">Yes</td>
                  <td className="p-2">—</td>
                </tr>

                {/* Dynamic Posts */}
                {posts?.map((post) => (
                  <tr key={post.id} className="border-b">
                    <td className="p-2">{post.title}</td>
                    <td className="p-2">{post.author || "Unknown"}</td>
                    <td className="p-2">{post.published ? "Yes" : "No"}</td>
                    <td className="p-2 space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(post)}
                        className="flex items-center gap-1"
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deletePost.mutate({ id: post.id })}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

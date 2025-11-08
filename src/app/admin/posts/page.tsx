"use client";

import React, { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

type Category = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  image?: string;
  author?: string;
  published?: boolean;
  categories?: Category[];
};

export default function AdminPostsPage() {
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    author: "",
    published: true,
  });

  const { data: posts, refetch: refetchPosts, isLoading: loadingPosts } =
    trpc.post.getAll.useQuery();
  const { data: categories } = trpc.category.getAll.useQuery<Category[]>();

  const createOrUpdatePost = trpc.post.update.useMutation({
    onSuccess: () => {
      setEditingPost(null);
      setSelectedCategories([]);
      refetchPosts();
    },
  });

  const createPost = trpc.post.create.useMutation({
    onSuccess: () => {
      setFormData({
        title: "",
        content: "",
        image: "",
        author: "",
        published: true,
      });
      setSelectedCategories([]);
      refetchPosts();
    },
  });

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      image: post.image || "",
      author: post.author || "",
      published: post.published ?? true,
    });
    setSelectedCategories(post.categories?.map((c) => c.id) || []);
  };

  const handleDelete = trpc.post.delete.useMutation({
    onSuccess: () => {
      refetchPosts();
    },
  });

  const handleSubmit = () => {
    if (editingPost) {
      createOrUpdatePost.mutate({
        id: editingPost.id,
        ...formData,
        categoryIds: selectedCategories,
      });
    } else {
      createPost.mutate({
        ...formData,
        categoryIds: selectedCategories,
      });
    }
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Posts</h1>

      {/* Post Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingPost ? "Edit Post" : "Create New Post"}
        </h2>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="w-full p-3 border rounded mb-3"
        />
        <textarea
          placeholder="Content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className="w-full p-3 border rounded mb-3 h-40"
        />
        <input
          type="text"
          placeholder="Author"
          value={formData.author}
          onChange={(e) =>
            setFormData({ ...formData, author: e.target.value })
          }
          className="w-full p-3 border rounded mb-3"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.value })
          }
          className="w-full p-3 border rounded mb-3"
        />
        <div className="mb-3">
          <label className="mr-2 font-medium">Published:</label>
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) =>
              setFormData({ ...formData, published: e.target.checked })
            }
          />
        </div>

        <div className="mb-4">
          <label className="font-medium mb-1 block">Categories:</label>
          <select
            multiple
            value={selectedCategories.map(String)}
            onChange={(e) =>
              setSelectedCategories(
                Array.from(e.target.selectedOptions, (opt) => Number(opt.value))
              )
            }
            className="w-full border p-2 rounded"
          >
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          {editingPost ? "Update Post" : "Create Post"}
        </button>
        {editingPost && (
          <button
            onClick={() => setEditingPost(null)}
            className="ml-3 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Posts Table */}
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
                <th className="p-2 text-left">Categories</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts?.map((post) => (
                <tr key={post.id} className="border-b">
                  <td className="p-2">{post.title}</td>
                  <td className="p-2">{post.author || "Unknown"}</td>
                  <td className="p-2">{post.published ? "Yes" : "No"}</td>
                  <td className="p-2">
                    {post.categories?.map((c) => c.name).join(", ")}
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDelete.mutate({ id: post.id })
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

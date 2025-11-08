"use client";

import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.post.getAll.useQuery();
  const deletePost = trpc.post.delete.useMutation({
    onSuccess: () => utils.post.getAll.invalidate(),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <button
        onClick={() => router.push("/create")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        + New Post
      </button>

      <ul className="space-y-3">
        {posts?.map((p) => (
          <li
            key={p.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <h2 className="font-medium">{p.title}</h2>
              <p className="text-sm text-gray-500">
                {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => router.push(`/edit/${p.id}`)}
                className="px-3 py-1 rounded bg-yellow-500 text-white"
              >
                Edit
              </button>
              <button
                onClick={() => deletePost.mutate({ id: p.id })}
                className="px-3 py-1 rounded bg-red-500 text-white"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

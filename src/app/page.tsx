"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { trpc } from "@/lib/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = { id: number; name: string };

type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  image?: string;
  author?: string;
  date?: string;
  categories?: Category[];
};

export default function HomePage() {
  // ✅ Always call hooks first and in same order
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isMounted, setIsMounted] = useState(false);

  // ✅ Only mount after hydration
  useEffect(() => setIsMounted(true), []);

  const { data: categories = [] } = trpc.category.getAll.useQuery<Category[]>(
    undefined,
    { enabled: isMounted }
  );

  const { data: posts = [] } = trpc.post.getAll.useQuery<Post[]>(
    undefined,
    { enabled: isMounted }
  );

  if (!isMounted) return null;

  // ✅ Dummy fallback posts (in case DB empty)
  const dummyPosts: Post[] = [
    {
      id: 1,
      slug: "technology-workplace",
      title: "The Impact of Technology on the Workplace",
      author: "Tracey Wilson",
      date: "Jan 28, 2023",
      categories: [{ id: 1, name: "Technology" }],
      image: "/images/virtualreality.png",
      content:
        "Technology is reshaping modern workplaces — discover the balance between efficiency and creativity.",
    },
    {
      id: 2,
      slug: "grid-system-ui",
      title: "Grid Systems for Better UI Design",
      author: "Bill Walsh",
      date: "Jan 25, 2023",
      categories: [{ id: 2, name: "Design" }],
      image: "/images/grid.jpg",
      content:
        "Explore how structured grid systems can make your user interfaces more harmonious and clean.",
    },
    {
      id: 3,
      slug: "business-tools-designers",
      title: "7 Business Tools Every Designer Needs",
      author: "Anna Roberts",
      date: "Jan 20, 2023",
      categories: [{ id: 3, name: "Business" }],
      image: "/images/7designtools.png",
      content:
        "From productivity to collaboration — these essential tools will make your workflow smoother.",
    },
    {
      id: 4,
      slug: "design-thinking",
      title: "Design Thinking for Product Innovation",
      author: "Maria Gomez",
      date: "Feb 10, 2023",
      categories: [{ id: 2, name: "Design" }],
      image: "/images/minimalism.jpg",
      content:
        "A guide on how design thinking fuels creativity and product innovation in modern teams.",
    },
    {
      id: 5,
      slug: "remote-work-success",
      title: "Secrets to Successful Remote Work",
      author: "Tom Hardy",
      date: "Mar 12, 2023",
      categories: [{ id: 1, name: "Technology" }],
      image: "/images/remote.jpg",
      content:
        "Remote work has transformed business culture. Learn how to stay productive and balanced.",
    },
    {
      id: 6,
      slug: "brand-storytelling",
      title: "The Power of Brand Storytelling",
      author: "Lisa Patel",
      date: "Apr 5, 2023",
      categories: [{ id: 3, name: "Business" }],
      image: "/images/productivity.png",
      content:
        "Storytelling builds emotional connections — discover how brands use stories to engage audiences.",
    },
  ];

  // ✅ Use DB posts if available, else dummy
  const allPosts: Post[] = posts.length > 0 ? posts : dummyPosts;

  // ✅ Filter posts
  const filteredPosts = allPosts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategory === "all"
        ? true
        : !!p.categories?.some((cat) => cat.name === selectedCategory);
    return matchSearch && matchCategory;
  });

  // ✅ Ensure at least 7 posts (1 featured + 6 others)
  const displayPosts = (() => {
    const needed = 7;
    const base = filteredPosts.slice(0, needed);
    if (base.length >= needed) return base;
    const existingIds = new Set(base.map((p) => p.id));
    const fillers = dummyPosts
      .filter((p) => !existingIds.has(p.id))
      .slice(0, needed - base.length);
    return [...base, ...fillers];
  })();

  const featuredPost = displayPosts[0];
  const otherPosts = displayPosts.slice(1, 7);

  // ✅ Safe image resolver
  const getSafeImageSrc = (
    maybeUrl?: unknown,
    fallback = "/images/virtualreality.png"
  ) => {
    if (!maybeUrl) return fallback;
    if (typeof maybeUrl !== "string") return fallback;
    const trimmed = maybeUrl.trim();
    if (trimmed.length === 0) return fallback;
    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("/")
    )
      return trimmed;
    return `/${trimmed}`;
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-800">
      {/* ================= NAVBAR ================= */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition"
          >
            Blog<span className="text-indigo-600">ify</span>
          </Link>

          <nav className="hidden md:flex space-x-6 text-sm text-gray-700 font-medium">
            <Link href="/" className="hover:text-indigo-500 transition">
              Home
            </Link>
            <Link href="/blogs" className="hover:text-indigo-500 transition">
              Blogs
            </Link>
            <Link href="/about" className="hover:text-indigo-500 transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-indigo-500 transition">
              Contact
            </Link>
          </nav>

          <Link
            href="/admin/posts"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            Admin
          </Link>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="text-center mt-12 mb-10 px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
          Discover Inspiring Stories & Ideas
        </h2>
        <p className="text-gray-500 mt-3 text-lg">
          Dive into thoughts and insights from creators across the world.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 items-center">
          <div className="w-full max-w-md">
            <Input
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-gray-300 shadow-sm"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[220px] bg-white border border-gray-300 shadow-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      {featuredPost && (
        <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 mb-16 items-center">
          <div className="relative h-[350px] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={getSafeImageSrc(featuredPost.image)}
              alt={featuredPost.title ?? "Featured Post"}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-sm text-indigo-600 font-medium mb-2">
              {featuredPost.categories
                ?.map((c) => c.name)
                .join(", ") ?? "Uncategorized"}
            </p>

            <Link href={`/blog/${featuredPost.slug}`}>
              <h3 className="text-3xl font-semibold mb-3 hover:text-indigo-600 transition">
                {featuredPost.title}
              </h3>
            </Link>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {featuredPost.content?.slice(0, 180)}...
            </p>

            <p className="text-gray-500 text-sm">
              By {featuredPost.author ?? "Unknown"} •{" "}
              {featuredPost.date ?? "Recently Published"}
            </p>
          </div>
        </section>
      )}

      {/* ================= MORE ARTICLES ================= */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold">More Articles</h3>
          <div className="text-sm text-gray-500">
            Showing {otherPosts.length} articles
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherPosts.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`}>
              <Card className="hover:shadow-xl transition-shadow duration-200 border border-gray-100 rounded-2xl">
                <div className="relative h-48 w-full rounded-t-2xl overflow-hidden">
                  <Image
                    src={getSafeImageSrc(blog.image, "/images/grid.jpg")}
                    alt={blog.title ?? "Article"}
                    fill
                    className="object-cover"
                  />
                </div>

                <CardHeader>
                  <CardTitle className="text-lg hover:text-indigo-600 transition">
                    {blog.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-indigo-600">
                    {blog.categories
                      ?.map((c) => c.name)
                      .join(", ") ?? "Uncategorized"}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-500 text-sm line-clamp-3">
                    {blog.content?.slice(0, 120)}...
                  </p>
                  <p className="text-gray-400 text-xs mt-3">
                    By {blog.author ?? "Anonymous"} •{" "}
                    {blog.date ?? "Recently"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-200 py-6 text-center text-gray-500 text-sm bg-white">
        © {new Date().getFullYear()} Blogify — Built with ❤️ using Next.js & tRPC.
      </footer>
    </main>
  );
}

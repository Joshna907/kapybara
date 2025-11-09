"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  createdAt?: string;
};

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const { data: categories = [] } = trpc.category.getAll.useQuery(undefined, {
    enabled: isMounted,
  });
  const { data: posts = [] } = trpc.post.getAll.useQuery(undefined, {
    enabled: isMounted,
  });

  // =================== Dummy fallback posts ===================
  const dummyPosts: Post[] = [
    {
      id: 1,
      slug: "technology-workplace",
      title: "The Impact of Technology on the Workplace",
      author: "Tracey Wilson",
      date: "Jan 28, 2023",
      categories: [{ id: 1, name: "Technology" }],
      image: "/images/virtualreality.png",
      content: `
Technology is transforming modern workplaces at an unprecedented pace. Tools like cloud-based collaboration platforms, AI analytics, and automation software are enabling teams to work more efficiently and communicate seamlessly. Remote work has become increasingly feasible, allowing employees flexibility while maintaining productivity.
      `,
    },
    {
      id: 2,
      slug: "grid-system-ui",
      title: "Grid Systems for Better UI Design",
      author: "Bill Walsh",
      date: "Jan 25, 2023",
      categories: [{ id: 2, name: "Design" }],
      image: "/images/grid.jpg",
      content: `
A well-structured grid system is the backbone of effective user interface (UI) design. By dividing layouts into consistent rows and columns, designers ensure visual harmony, proper alignment, and better readability.
      `,
    },
    {
      id: 3,
      slug: "business-tools-designers",
      title: "7 Business Tools Every Designer Needs",
      author: "Anna Roberts",
      date: "Jan 20, 2023",
      categories: [{ id: 3, name: "Business" }],
      image: "/images/7designtools.png",
      content: `
In today’s fast-paced business environment, designers require a combination of creativity and efficiency to succeed.
      `,
    },
    {
      id: 4,
      slug: "design-thinking",
      title: "Design Thinking for Product Innovation",
      author: "Maria Gomez",
      date: "Feb 10, 2023",
      categories: [{ id: 2, name: "Design" }],
      image: "/images/minimialism.jpg",
      content: `
Design thinking is a human-centered approach to innovation that encourages empathy, creativity, and experimentation.
      `,
    },
    {
      id: 5,
      slug: "remote-work-success",
      title: "Secrets to Successful Remote Work",
      author: "Tom Hardy",
      date: "Mar 12, 2023",
      categories: [{ id: 1, name: "Technology" }],
      image: "/images/remote.jpg",
      content: `
Remote work has become a defining feature of modern business, offering flexibility, autonomy, and new opportunities.
      `,
    },
    {
      id: 6,
      slug: "brand-storytelling",
      title: "The Power of Brand Storytelling",
      author: "Lisa Patel",
      date: "Apr 5, 2023",
      categories: [{ id: 3, name: "Business" }],
      image: "/images/productivity.png",
      content: `
Brand storytelling is a powerful way for companies to connect with audiences on a deeper, emotional level.
      `,
    },
  ];

  // =================== Combine dummy + dynamic posts ===================
  const combinedPosts = useMemo(() => {
    const allPosts = [...dummyPosts, ...(posts || [])];

    // Avoid duplicates by slug
    const unique = allPosts.filter(
      (post, index, self) => index === self.findIndex((p) => p.slug === post.slug)
    );

    // Sort by date or createdAt
    return unique.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || "").getTime();
      const dateB = new Date(b.createdAt || b.date || "").getTime();
      return dateB - dateA;
    });
  }, [posts]);

  // =================== Filter posts dynamically ===================
  const filteredPosts = useMemo(() => {
    return combinedPosts.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === "all"
          ? true
          : !!p.categories?.some((cat) => cat.name === selectedCategory);
      return matchSearch && matchCategory;
    });
  }, [combinedPosts, search, selectedCategory]);

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1, 7);

  if (!isMounted) return null;

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
            <Link href="/about" className="hover:text-indigo-500 transition">
              About
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
              sizes="(max-width: 768px) 100vw, 50vw"
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
              {featuredPost.content?.slice(0, 300)}...
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
            <Link key={blog.slug} href={`/blog/${blog.slug}`}>
              <Card className="hover:shadow-xl transition-shadow duration-200 border border-gray-100 rounded-2xl">
                <div className="relative h-48 w-full rounded-t-2xl overflow-hidden">
                  <Image
                    src={getSafeImageSrc(blog.image, "/images/grid.jpg")}
                    alt={blog.title ?? "Article"}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
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
        © {new Date().getFullYear()} Blogify — Built with Next.js & tRPC.
      </footer>
    </main>
  );
}

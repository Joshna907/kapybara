// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold">
            B
          </div>
          <div className="text-lg font-semibold text-gray-900">Blogify</div>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/blog" className="text-gray-700 hover:text-indigo-600">
            Blogs
          </Link>
          <Link href="/categories" className="text-gray-700 hover:text-indigo-600">
            Categories
          </Link>
          <Link href="/admin/posts" className="text-gray-700 hover:text-indigo-600">
            Dashboard
          </Link>
          <Link
            href="#"
            className="ml-3 bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}

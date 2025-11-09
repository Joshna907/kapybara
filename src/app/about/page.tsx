"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <Link href="/" className="text-xl font-bold">
          Kapybara Blog
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          
          <Link href="/about" className="font-semibold text-primary underline">
            About
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow text-center px-6 py-20 bg-gradient-to-b from-background to-muted">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your Voice. Your Stories.
        </motion.h1>
        <motion.p
          className="text-muted-foreground max-w-2xl mb-8 text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Share your thoughts, learn from others, and explore the world of ideas —
          all in one beautiful place.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/">
            <Button size="lg" className="px-8">
              Start Reading
            </Button>
          </Link>
        </motion.div>
      </section>

      <Separator className="my-10 w-3/4 mx-auto" />

      {/* Features Section */}
      <section className="px-6 py-12 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {[
          {
            title: "Write Effortlessly",
            desc: "Create and publish your stories in minutes using our beautiful Markdown editor.",
          },
          {
            title: "Organize with Categories",
            desc: "Keep your posts well-structured and easy to find by adding categories.",
          },
          {
            title: "Read Anywhere",
            desc: "Enjoy a seamless reading experience across all your devices.",
          },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
          >
            <Card className="h-full shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {feature.desc}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Kapybara Blog. All rights reserved.
      </footer>
    </div>
  );
}

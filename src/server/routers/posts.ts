// src/server/routers/post.ts
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "@/db";
import { posts, categories, postCategories } from "@/db/schema";
import { eq, inArray, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const postRouter = router({
  // Fetch all posts with their categories aggregated
  getAll: publicProcedure.query(async () => {
    try {
      const rawPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
      const mappings = await db.select().from(postCategories);
      const allCategories = await db.select().from(categories);

      const catById = new Map<number, any>();
      allCategories.forEach((c) => catById.set(c.id, c));

      const postsWithCats = rawPosts.map((p) => {
        const linked = mappings
          .filter((m) => m.postId === p.id)
          .map((m) => catById.get(m.categoryId))
          .filter(Boolean);
        return { ...p, categories: linked };
      });

      return postsWithCats;
    } catch (err) {
      console.error("post.getAll error:", err);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch posts" });
    }
  }),

  // Get post by slug
  // Get post by slug (for post/[slug])
getBySlug: publicProcedure
  .input(z.object({ slug: z.string() }))
  .query(async ({ input }) => {
    try {
     console.log("🧭 getBySlug called with slug:", input.slug);

const rows = await db.select().from(posts);
console.log("📜 All slugs in DB:", rows.map((p) => p.slug));

const post = rows.find((p) => p.slug === input.slug);
if (!post) {
  console.log("❌ No matching post found for slug:", input.slug);
  return null;
}


      const links = await db
        .select()
        .from(postCategories)
        .where(eq(postCategories.postId, post.id));

      const cats = await db
        .select()
        .from(categories)
        .where(inArray(categories.id, links.map((l) => l.categoryId)));

      return {
        ...post,
        categoryNames: cats.map((c) => c.name),
        coverImage:
          post.image ||
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80", // fallback image
      };
    } catch (err) {
      console.error("post.getBySlug error:", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch post",
      });
    }
  }),


  // Get posts by category slug
  getByCategorySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    try {
      const catRows = await db.select().from(categories).where(eq(categories.slug, input.slug));
      const category = catRows[0];
      if (!category) return [];

      const links = await db.select().from(postCategories).where(eq(postCategories.categoryId, category.id));
      const ids = links.map((l) => l.postId);
      if (ids.length === 0) return [];

      const postRows = await db.select().from(posts).where(inArray(posts.id, ids)).orderBy(posts.createdAt.desc);

      const mappings = await db.select().from(postCategories).where(inArray(postCategories.postId, ids));
      const catIds = Array.from(new Set(mappings.map((m) => m.categoryId)));
      const cats = await db.select().from(categories).where(inArray(categories.id, catIds));

      const catById = new Map<number, any>();
      cats.forEach(c => catById.set(c.id, c));

      const results = postRows.map((p) => {
        const linked = mappings.filter(m => m.postId === p.id).map(m => catById.get(m.categoryId)).filter(Boolean);
        return { ...p, categories: linked };
      });

      return results;
    } catch (err) {
      console.error("post.getByCategorySlug error:", err);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch posts for category" });
    }
  }),

  // Create a post with optional categories
  create: publicProcedure.input(z.object({
    title: z.string().min(1).max(255),
    content: z.string().min(1),
    slug: z.string().optional(),
    published: z.boolean().optional(),
    categoryIds: z.array(z.number()).optional(),
    author: z.string().optional(),
    image: z.string().optional(),
  })).mutation(async ({ input }) => {
    try {
      const slug = input.slug?.trim() || input.title.toLowerCase().trim().replace(/\s+/g, "-").slice(0, 255);

      const inserted = await db.insert(posts).values({
        title: input.title.trim(),
        content: input.content,
        slug,
        published: input.published ?? true,
        author: input.author ?? null,
        image: input.image ?? null,
      }).returning();

      const createdPost = inserted[0];

      if (input.categoryIds && input.categoryIds.length > 0) {
        const values = input.categoryIds.map(cid => ({ postId: createdPost.id, categoryId: cid }));
        await db.insert(postCategories).values(values);
      }

      return createdPost;
    } catch (err: any) {
      console.error("post.create error:", err);
      if (err?.code === "23505") {
        throw new TRPCError({ code: "CONFLICT", message: "Post slug conflict" });
      }
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create post" });
    }
  }),

  // Update a post and its categories
  update: publicProcedure.input(z.object({
    id: z.number(),
    title: z.string().optional(),
    content: z.string().optional(),
    slug: z.string().optional(),
    published: z.boolean().optional(),
    categoryIds: z.array(z.number()).optional(),
    author: z.string().optional(),
    image: z.string().optional(),
  })).mutation(async ({ input }) => {
    try {
      const { id, categoryIds, ...rest } = input;
      const updateObj: any = {};
      if (rest.title !== undefined) updateObj.title = rest.title.trim();
      if (rest.content !== undefined) updateObj.content = rest.content;
      if (rest.slug !== undefined) updateObj.slug = rest.slug.trim();
      if (rest.published !== undefined) updateObj.published = rest.published;
      if (rest.author !== undefined) updateObj.author = rest.author;
      if (rest.image !== undefined) updateObj.image = rest.image;

      const res = await db.update(posts).set(updateObj).where(eq(posts.id, id)).returning();
      const updatedPost = res[0];

      if (categoryIds) {
        await db.delete(postCategories).where(eq(postCategories.postId, id));
        if (categoryIds.length > 0) {
          const values = categoryIds.map(cid => ({ postId: id, categoryId: cid }));
          await db.insert(postCategories).values(values);
        }
      }

      return updatedPost;
    } catch (err) {
      console.error("post.update error:", err);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update post" });
    }
  }),

  // Delete post and its category mappings
  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await db.delete(postCategories).where(eq(postCategories.postId, input.id));
      await db.delete(posts).where(eq(posts.id, input.id));
      return { success: true };
    } catch (err) {
      console.error("post.delete error:", err);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete post" });
    }
  }),
});

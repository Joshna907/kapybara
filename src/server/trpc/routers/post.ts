import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "@/db";
import { posts, categories, postCategories } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export const postRouter = router({
  // Get all posts
  getAll: publicProcedure.query(async () => {
    return await db.query.posts.findMany({
      with: { categories: true },
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  // Get post by slug
  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const post = await db.query.posts.findFirst({
      where: eq(posts.slug, input.slug),
      with: { categories: true },
    });
    return post;
  }),

  // Get posts by category slug (using join table)
  getByCategorySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const category = await db.query.categories.findFirst({
        where: eq(categories.slug, input.slug),
      });
      if (!category) return [];

      const postLinks = await db
        .select()
        .from(postCategories)
        .where(eq(postCategories.categoryId, category.id));

      const postIds = postLinks.map((p) => p.postId);

      if (postIds.length === 0) return [];

      const relatedPosts = await db.query.posts.findMany({
        where: inArray(posts.id, postIds),
        with: { categories: true },
      });

      return relatedPosts;
    }),

  // Create a new post (with categories)
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        slug: z.string(),
        categories: z.array(z.number()), // array of category IDs
      })
    )
    .mutation(async ({ input }) => {
      const post = await db.insert(posts).values({
        title: input.title,
        content: input.content,
        slug: input.slug,
        published: true,
      }).returning();

      // Add post-category relationships
      for (const categoryId of input.categories) {
        await db.insert(postCategories).values({
          postId: post[0].id,
          categoryId,
        });
      }

      return post[0];
    }),

  // Delete a post
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(postCategories).where(eq(postCategories.postId, input.id));
      await db.delete(posts).where(eq(posts.id, input.id));
      return { success: true };
    }),
});

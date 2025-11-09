import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const categoryRouter = router({
  // Get all categories
  getAll: publicProcedure.query(async () => {
    try {
      const rows = await db.select().from(categories).orderBy(desc(categories.id));
      return rows;
    } catch (err) {
      console.error("category.getAll error:", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch categories",
      });
    }
  }),

  // Get single category by slug
  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    try {
      const result = await db.select().from(categories).where(eq(categories.slug, input.slug));
      return result[0] ?? null;
    } catch (err) {
      console.error("category.getBySlug error:", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch category",
      });
    }
  }),

  // Create category
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        slug: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const slug = input.slug || input.name.toLowerCase().replace(/\s+/g, "-");
        const inserted = await db
          .insert(categories)
          .values({ name: input.name, slug })
          .returning();
        return inserted[0];
      } catch (err) {
        console.error("category.create error:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create category",
        });
      }
    }),
  update: publicProcedure
    .input(z.object({ id: z.number(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(categories)
        .set({ name: input.name })
        .where(eq(categories.id, input.id));
    }),

  // Delete category
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await db.delete(categories).where(eq(categories.id, input.id));
        return { success: true };
      } catch (err) {
        console.error("category.delete error:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete category",
        });
      }
    }),
});

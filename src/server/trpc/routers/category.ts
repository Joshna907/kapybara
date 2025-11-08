import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export const categoryRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db.select().from(categories);
  }),

  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      const slug = input.name.toLowerCase().replace(/\s+/g, "-");
      return await db.insert(categories).values({ name: input.name, slug }).returning();
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});

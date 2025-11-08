// src/server/routers/index.ts
import { router } from "../trpc";
import { postRouter } from "./posts";
import { categoryRouter } from "./categories";

export const appRouter = router({
  post: postRouter,
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;

import { router } from "../trpc";
import { postRouter } from "./posts";
import { categoryRouter } from "./categories";

export const appRouter = router({
  post: postRouter,
  category: categoryRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;

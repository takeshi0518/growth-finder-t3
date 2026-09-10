import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { staffRouter } from "./routers/staff";
import { evaluationRouter } from "./routers/evaluation";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  staff: staffRouter,
  evaluation: evaluationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 */
export const createCaller = createCallerFactory(appRouter);

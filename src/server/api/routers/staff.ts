import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const staffRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.staff.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
});

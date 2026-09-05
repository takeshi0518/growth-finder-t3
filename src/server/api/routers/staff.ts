import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const staffRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.staff.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        position: z.string().optional(),
        hiredAt: z.coerce.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.staff.create({
        data: {
          name: input.name,
          position: input.position,
          hiredAt: input.hiredAt,
        },
      });
    }),
});

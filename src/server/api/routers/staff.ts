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
        name: z.string().min(1, "名前を入力してください"),
        position: z.string().min(1, "役職を入力してください").optional(),
        hiredAt: z
          .string()
          .optional()
          .transform((v) => (v ? new Date(v) : undefined)),
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
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.staff.findUnique({ where: { id: input.id } });
    }),
});

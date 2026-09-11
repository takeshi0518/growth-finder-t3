import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const evaluationRouter = createTRPCRouter({
  getForStaff: publicProcedure
    .input(z.object({ staffId: z.string(), period: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.evaluation.findUnique({
        where: {
          staffId_period: { staffId: input.staffId, period: input.period },
        },
        include: { scores: { orderBy: { displayOrder: "asc" } } },
      });
    }),
  save: publicProcedure
    .input(
      z.object({
        staffId: z.string(),
        period: z.string(),
        comment: z.string().optional(),
        status: z.enum(["DRAFT", "COMPLETED"]),
        scores: z.array(
          z.object({
            itemName: z.string(),
            category: z.string(),
            score: z.number().int().min(0),
            maxScore: z.number().int(),
            displayOrder: z.number().int(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const evaluation = await tx.evaluation.upsert({
          where: {
            staffId_period: { staffId: input.staffId, period: input.period },
          },
          create: {
            staffId: input.staffId,
            period: input.period,
            comment: input.comment,
            status: input.status,
          },
          update: {
            comment: input.comment,
            status: input.status,
          },
        });

        await tx.evaluationScore.deleteMany({
          where: { evaluationId: evaluation.id },
        });

        await tx.evaluationScore.createMany({
          data: input.scores.map((s) => ({
            ...s,
            evaluationId: evaluation.id,
          })),
        });
        return evaluation;
      });
    }),
});

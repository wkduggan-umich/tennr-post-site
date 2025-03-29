import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";

export const threadRouter = createTRPCRouter({
    getAllThreads : protectedProcedure.query(async ({ ctx }) => {
        const threads = await ctx.db.thread.findMany(
        {
            orderBy: { createdAt: "desc" },
        }
        );

        return threads ?? null;
    }),

    getThreadById : protectedProcedure
    .input(z.object({threadId : z.number()}))
    .query(async ({ ctx, input }) => {
        const thread = await ctx.db.thread.findFirst(
        {
            where: { id : input.threadId },
        }
        );

        return thread ?? null;
    }),

    create: protectedProcedure
        .input(z.object({ title: z.string().min(1), text: z.string() }))
        .mutation(async ({ ctx, input }) => {
          return ctx.db.thread.create({
            data: {
              title: input.title,
              text: input.text,
              createdBy: { connect: { id: ctx.session.user.id } },
            },
          });
        }),
});

import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUsername: protectedProcedure
  .input(z.object({ userId : z.string() }))
  .query(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: input.userId },
    });
    return user?.name ?? null;
  }
  ),
});

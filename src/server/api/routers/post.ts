import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), text: z.string(), threadId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          text: input.text,
          createdBy: { connect: { id: ctx.session.user.id } },
          createdByName : ctx.session.user.name,
          thread: { connect: {id: input.threadId}},
        },
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });

    return post ?? null;
  }),

  getAllPosts : protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany(
      {
        orderBy: { votes: "desc" },
      }
    );

    return posts ?? null;
  }),

  getPostById : protectedProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ ctx, input }) => {
    const post = await ctx.db.post.findMany(
      {
        where: { id: input.postId},
      }
    );
    return post ?? null;
  }),

  vote: protectedProcedure
    .input(z.object({ postId: z.number(), up_down: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.postId },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      return ctx.db.post.update({
        where: { id: input.postId },
        data: { votes : input.up_down ? post.votes + 1 : post.votes - 1 },
      });
    }),

    get_vote: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: { id: input.postId },
      });
  
      return post?.votes ?? null;
    }),

    getAllPostForThread : protectedProcedure
    .input(z.object({ threadId : z.number() }))
    .query(async ({ctx, input}) => {
      const posts = await ctx.db.post.findMany({
        orderBy: { votes : "desc" },
        where: { threadId : input.threadId },
      })
      return posts ?? null;
    }),

    delete : protectedProcedure
    .input(z.object({ postId : z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.delete({
        where: { id : input.postId },
      })
    }),
});

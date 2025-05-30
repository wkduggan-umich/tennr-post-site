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

      if (post.voterIds.some((user) => user == ctx.session.user.id)) {
        throw new Error("User has voted")
      }

      return ctx.db.post.update({
        where: { id: input.postId },
        data: { 
          votes : input.up_down ? post.votes + 1 : post.votes - 1,
          voterIds : post.voterIds.concat(ctx.session.user.id)
        },
      });
    }),

    userHasVoted : protectedProcedure
    .input(z.object({ postId: z.number()}))
    .query(async ({ ctx, input}) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.postId },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      return post.voterIds.some((user) => user == ctx.session.user.id)
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
      const post = await ctx.db.post.findFirst({
        where: { id : input.postId }
      })
      
      if(ctx.session.user.id != post?.createdById) {
        throw new Error("Invalid deletion. User is not the creator.")
      }

      return ctx.db.post.delete({
        where: { id : input.postId },
      })
    }),

    getAllPostsForUser : protectedProcedure
    .input(z.object({ userId : z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        where : { createdById : input.userId }
      })

      return posts ?? null
    }),

    editPost : protectedProcedure
    .input(z.object({ id : z.number(), new_name : z.string(), new_text : z.string() })).
    mutation(async ({ ctx, input }) => {
      const post = ctx.db.post.findFirst({
        where : { id : input.id },
      });

      if(post == null) {
        throw new Error("Invalid edit, post does not exist");
      }

      return ctx.db.post.update({
        where : { id : input.id },
        data : {
          name : input.new_name,
          text : input.new_text,
        }
      });
    }),
});

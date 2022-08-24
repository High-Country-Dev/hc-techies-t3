import z from "zod";
import { createProtectedRouter } from "../protected-router";

const post = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().nullable(),
  isPrivate: z.boolean(),
  userId: z.string(),
});

const postRouter = createProtectedRouter()
  .query("getById", {
    input: z.string(),
    resolve({ ctx, input }) {
      return ctx.prisma.post.findUnique({
        where: { id: input },
        include: { user: true },
      });
    },
  })
  .mutation("insert", {
    input: post
      .omit({ id: true, userId: true })
      .partial({ content: true, isPrivate: true }),
    resolve({ ctx, input }) {
      return ctx.prisma.post.create({
        data: {
          ...input,
          user: { connect: { id: ctx.user.id } },
        },
      });
    },
  })
  .mutation("updateById", {
    input: post
      .omit({ userId: true })
      .partial({ content: true, isPrivate: true }),
    resolve({ ctx, input }) {
      return ctx.prisma.post.update({
        where: { id: input.id },
        data: {
          ...input,
        },
      });
    },
  })
  .mutation("deleteById", {
    input: z.string(),
    resolve({ ctx, input }) {
      return ctx.prisma.post.delete({
        where: { id: input },
      });
    },
  });

export default postRouter;

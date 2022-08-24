import { createRouter } from "../../createContext";

const postRouter = createRouter().query("getAll", {
  resolve({ ctx }) {
    return ctx.user
      ? ctx.prisma.post.findMany({
          where: { OR: [{ isPrivate: false }, { userId: ctx.user.id }] },
        })
      : ctx.prisma.post.findMany({ where: { isPrivate: false } });
  },
});

export default postRouter;

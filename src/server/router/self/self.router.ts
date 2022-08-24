import z from "zod";
import { createRouter } from "../../createContext";
import { prismaUserSelect } from "./self.schema";
import { TRPCError } from "@trpc/server";

const SelfRouter = createRouter()
  .query("get", {
    resolve({ ctx }) {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return ctx.prisma.user.findUniqueOrThrow({
        where: { id: ctx.user.id },
        select: prismaUserSelect,
      });
    },
  })
  .mutation("update", {
    input: z.object({
      name: z.string().nullish(),
      email: z.string().email().optional(),
    }),
    resolve({ ctx, input }) {
      return ctx.prisma.user.update({
        where: { id: ctx.user?.id },
        data: input,
      });
    },
  });

export default SelfRouter;

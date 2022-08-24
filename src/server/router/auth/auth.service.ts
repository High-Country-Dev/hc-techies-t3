import { hash, compare } from "bcryptjs";
import { Context } from "../../createContext";
import { TLoginInput, TSignUpInput, TAuthWithToken } from "./auth.schema";
import { TRPCError } from "@trpc/server";
import { JwtService } from "../../util/jwt";
import { prismaUserSelect } from "../self/self.schema";
import { PrismaClient } from "@prisma/client";
import { setCookie, deleteCookie } from "cookies-next";
import { ECookie } from "../../types/cookie.type";

const jwtService = new JwtService();

export class AuthService {
  async viaToken({ email, name }: TAuthWithToken, prisma: PrismaClient) {
    if (!email || !name) return null;

    const user = await prisma.user.findFirst({ where: { email } });

    if (user) {
      return user;
    }

    const [first_name, last_name] = name.split(" ");

    if (!first_name || !last_name) return null;

    const newUser = await prisma.user.create({
      data: { email, name, password: "" },
    });

    return newUser;
  }

  async signup({ input, ctx }: { input: TSignUpInput; ctx: Context }) {
    const { email, password, name, role } = input;
    const hashedPassword = await hash(password, 12);
    const { req, res } = ctx;

    const exists = await ctx.prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });
    console.log("exists", exists, email);

    if (exists) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User already exists.",
      });
    }

    const user = await ctx.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role,
      },
      select: prismaUserSelect,
    });

    const { accessToken, refreshToken } = jwtService.createPair(user);

    setCookie(ECookie.access_token, accessToken, { req, res });
    setCookie(ECookie.refresh_token, refreshToken, { req, res });

    return { user, accessToken, refreshToken };
  }

  async login({ input, ctx }: { input: TLoginInput; ctx: Context }) {
    const { email, password } = input;
    const { req, res } = ctx;

    const user = await ctx.prisma.user.findFirst({
      where: { email: email.toLowerCase() },
      select: {
        ...prismaUserSelect,
        password: true,
      },
    });

    if (!user) {
      console.error("User not found");
      throw new TRPCError({ code: "UNAUTHORIZED" });
    } else {
      console.log("Login found user", user.id);
    }

    if (!(await compare(password, user.password))) {
      console.error("Passwords do not match");
      throw new TRPCError({ code: "UNAUTHORIZED" });
    } else {
      console.log("Passwords match");
    }

    const { accessToken, refreshToken } = jwtService.createPair(user);

    setCookie(ECookie.access_token, accessToken, { req, res });
    setCookie(ECookie.refresh_token, refreshToken, { req, res });

    return { user, accessToken, refreshToken };
  }

  async refresh({ ctx }: { ctx: Context }) {
    return { ctx };
  }

  async logout({ ctx }: { ctx: Context }) {
    const { req, res } = ctx;

    deleteCookie(ECookie.access_token, { req, res });
    deleteCookie(ECookie.refresh_token, { req, res });

    return { success: true };
  }
}

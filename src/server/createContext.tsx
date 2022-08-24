import * as trpc from "@trpc/server";
import { IncomingMessage } from "http";
import * as trpcNext from "@trpc/server/adapters/next";
import { User, Role } from "@prisma/client";
import { prisma } from "./db/client";
import { JwtService } from "./util/jwt";
import { getCookie } from "cookies-next";
import { ECookie } from "./types/cookie.type";
import { getToken } from "next-auth/jwt";
import { AuthService } from "./router/auth/auth.service";

const jwtService = new JwtService();
const authService = new AuthService();

export const isAdmin = (userRole: User["role"] | undefined) => {
  return userRole === Role.ADMIN;
};

export const createRouter = () => trpc.router<Context>();

export const getUserFromHeader = async (
  headers: IncomingMessage["headers"]
) => {
  const authHeader = headers.authorization;
  console.log("createContext getUserFromHeader", authHeader);
  if (authHeader) {
    try {
      const user = await jwtService.verify(authHeader.split(" ")[1] as string);
      return user;
    } catch (err) {
      return null;
    }
  }
  return null;
};

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const data = await getToken({ req, secret: process.env.NEXTAUTH_URL });
  const headerUser = await getUserFromHeader(req.headers);

  const accessToken = getCookie(ECookie.access_token, { req, res }) as string;
  console.log(
    "accessToken",
    accessToken,
    "JSON Web Token",
    JSON.stringify(data, null, 2)
  );
  const tokenUser = accessToken
    ? jwtService.verify(accessToken)
    : (await authService.viaToken(
        { email: data?.email, name: data?.name },
        prisma
      )) ?? null;

  return {
    headers: req.headers,
    // isAdmin: isAdmin(user?.role),
    req,
    res,
    prisma,
    ...(headerUser
      ? { user: headerUser }
      : tokenUser
      ? { user: tokenUser }
      : {}),
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

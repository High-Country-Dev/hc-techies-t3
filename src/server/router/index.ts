// src/server/router/index.ts
import superjson from "superjson";

import selfRouter from "./self/self.router";
import postRouter from "./post/post.router";
import { createRouter } from "../createContext";
import wallRouter from "./wall/wall.router";
import { authRouter } from "./auth/auth.router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("wall.", wallRouter)
  .merge("self.", selfRouter)
  .merge("post.", postRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

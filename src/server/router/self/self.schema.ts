import { z } from "zod";
import { Role } from "@prisma/client";

export const UserModel = z.object({
  id: z.string().uuid(),
  email: z.string(),
  role: z.nativeEnum(Role).optional().default(Role.USER),
  name: z.string().nullish(),
  password: z.string().optional(),
});

export const prismaUserSelect = {
  id: true,
  email: true,
  password: false,
  role: true,
  name: true,
};

export type TUserModel = z.TypeOf<typeof UserModel>;

export const UserInput = UserModel.omit({ id: true, password: true }).merge(
  z.object({
    password: z.string(),
  })
);

export type TUserInput = z.TypeOf<typeof UserInput>;

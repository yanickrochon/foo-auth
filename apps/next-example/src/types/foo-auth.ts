import z from "zod";

import { credentialsValidation } from "../schema/foo-auth";

import data from "../data.json";

type DataArray<T> = T extends readonly (infer ElementType)[]
  ? ElementType
  : never;
type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export type User = DataArray<typeof data.users>;

export type SessionSnapshot = {
  sub: PropType<User, "id">;
};

export type UserSession = {
  user: Omit<User, "password">;
};

export type UserCredentials = z.infer<typeof credentialsValidation>;

import { sessionCookie, createSecretKey } from "@foo-auth/core";

import { credentials } from "@foo-auth/provider-credentials";

import { endpointPaths, secret } from "../../foo-auth.config";

import type { NextFooAuthConfig } from "@foo-auth/next";

import data from "../data.json";

type DataArray<T> = T extends readonly (infer ElementType)[]
  ? ElementType
  : never;

export type UserData = DataArray<typeof data.users>;

export type SessionType = Omit<UserData, "password">;

export interface UserCredentials {
  username: string;
  password: string;
}

const convertSessionType = (user: UserData | null): SessionType => {
  const sessionValue = { ...user } as any;
  delete sessionValue.password;
  return sessionValue;
};

const findUser = (predicate: (user: UserData) => boolean) => {
  for (const user of data.users) {
    if (predicate(user)) {
      return user;
    }
  }

  return null;
};

export const fooAuthConfig: NextFooAuthConfig<SessionType> = {
  endpointPaths,

  session: sessionCookie({
    saveSession(sessionValue) {
      return { id: sessionValue.id };
    },
    restoreSession(snapshot) {
      const user = findUser((user) => user.id === snapshot.id);

      return convertSessionType(user);
    },
  }),

  providers: [
    credentials<UserCredentials, SessionType>({
      authenticate(credentials: UserCredentials) {
        const user = findUser(
          (user) =>
            user.username === credentials.username &&
            user.password === credentials.password
        );

        if (user) {
          return convertSessionType(user);
        } else {
          return null;
        }
      },
    }),
  ],

  secretKey: createSecretKey(secret),
};

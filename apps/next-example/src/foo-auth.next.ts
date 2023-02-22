import { createSecretKey } from "@foo-auth/core";
import { sessionCookie } from "@foo-auth/session-cookie";

import { credentials } from "@foo-auth/provider-credentials";

import { endpointPaths, pages, secret } from "../foo-auth.config";

import data from "./data.json";

import type { NextFooAuthOptions } from "@foo-auth/next";

import type {
  User,
  SessionSnapshot,
  UserSession,
  UserCredentials,
} from "./types/foo-auth";

const convertSessionType = (user: User | null): UserSession => {
  const sessionValue = Object.assign({}, user as Omit<User, "password">);
  delete (sessionValue as any).password;
  return { user: sessionValue };
};

const findUser = (predicate: (user: User) => boolean) => {
  for (const user of data.users) {
    if (predicate(user)) {
      return user;
    }
  }

  return null;
};

export const fooAuthOptions: NextFooAuthOptions<UserSession> = {
  endpointPaths,
  pages,

  session: sessionCookie<UserSession, SessionSnapshot>({
    saveSession(sessionValue) {
      return { sub: sessionValue.user?.id ?? "" };
    },
    restoreSession(snapshot) {
      const user = findUser((user) => user.id === snapshot?.sub);

      return user ? convertSessionType(user) : null;
    },
  }),

  providers: [
    credentials<UserCredentials, UserSession>({
      authenticate(credentials: UserCredentials) {
        const user = findUser(
          (user) =>
            user.username === credentials.username &&
            user.password === credentials.password
        );

        return user ? convertSessionType(user) : null;
      },
    }),
  ],

  secretKey: createSecretKey(secret),
};

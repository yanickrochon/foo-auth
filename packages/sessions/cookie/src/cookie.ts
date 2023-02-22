//import * as jose from 'jose';

import {
  encryptString,
  decryptString,
  type FooAuthSessionInitOptions,
  type FooAuthSession,
  type FooAuthSessionConfig,
} from "@foo-auth/core";

export type FooSessionCookiesConfig<SessionType, SessionSnapshot = any> = {
  sessionName?: string;
} & FooAuthSessionConfig<SessionType, SessionSnapshot>;

export const DEFAULT_SESSION_COOKIE_NAME = "foo-auth:session";

const defaultSaveSession = <SessionType, SessionSnapshot>(
  x: SessionType
): SessionSnapshot => x as any;
const defaultRestoreSession = <SessionType, SessionSnapshot>(
  x: SessionSnapshot
): SessionType => x as any;

export function sessionCookie<SessionType, SessionSnapshot>({
  sessionName = DEFAULT_SESSION_COOKIE_NAME,
  saveSession = defaultSaveSession,
  restoreSession = defaultRestoreSession,
}: FooSessionCookiesConfig<SessionType, SessionSnapshot> = {}) {
  return ({
    req,
    secretKey,
  }: FooAuthSessionInitOptions<SessionType>): FooAuthSession<SessionType> => ({
    secretKey,
    clearSession() {
      req.cookies.set(sessionName, undefined);
    },

    hasSession() {
      return req.cookies.has(sessionName);
    },

    getSessionToken() {
      // do not expore cookie
      return undefined;
    },

    async getSession() {
      const encrypted = req.cookies.get(sessionName) ?? "";
      let sessionValue = null;

      try {
        const snapshot = decryptString({ encrypted, secretKey });

        if (snapshot) {
          sessionValue = restoreSession(JSON.parse(snapshot as any));
        }
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.error(e);
        }
      }

      return sessionValue;
    },

    async setSession(payload) {
      const snapshot = saveSession(payload);
      const token = encryptString({
        text: JSON.stringify(snapshot),
        secretKey,
      });

      req.cookies.set(sessionName, token);

      // do not expore cookie
      return undefined;
    },
  });
}

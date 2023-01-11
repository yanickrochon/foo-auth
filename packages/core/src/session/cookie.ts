//import * as jose from 'jose';

import { encrypt, decrypt } from '../encryption/string';
import type { FooSessionInitArg, FooSession, FooSessionConfig } from '../internals';


export type FooSessionCookiesConfig<SessionType> = {
  sessionName?:string;
} & FooSessionConfig<SessionType>;

export const DEFAULT_SESSION_COOKIE_NAME = 'foo-auth:session';

export function sessionCookie<SessionType = any>({
  sessionName = DEFAULT_SESSION_COOKIE_NAME,
  encodeSession,
  decodeSession
}:FooSessionCookiesConfig<SessionType>) {
  return ({ cookies, secretKey }:FooSessionInitArg):FooSession<SessionType> => ({
    clearSession() {
      cookies.set(sessionName, null);
    },

    getSessionToken() {
      return undefined;
    },

    async getSession() {
      const encrypted = cookies.get(sessionName) ?? '';

      try {
        const decrypted = decrypt({ encrypted, secretKey })

        if (decrypted) {
          const payload = await decodeSession(JSON.parse(decrypted));

          return payload;
        } else {
          return null;
        }
      } catch (e) {
        return null; // failed to parse cookie, assume invalid session
      }
    },

    async setSession(payload) {
      const data = await encodeSession(payload);
      const encrypted = encrypt({
        text: JSON.stringify(data),
        secretKey
      });

      cookies.set(sessionName, encrypted);

      return encrypted;
    },
  });
};
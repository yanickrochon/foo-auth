//import * as jose from 'jose';

import { encryptString, decryptString } from '../encryption/string';
import type { FooAuthSessionInitArg, FooAuthSession, FooAuthSessionConfig } from '../types';


export type FooSessionCookiesConfig<SessionType> = {
  sessionName?:string;
} & FooAuthSessionConfig<SessionType>;

export const DEFAULT_SESSION_COOKIE_NAME = 'foo-auth:session';


export function sessionCookie<SessionType = any>({
  sessionName = DEFAULT_SESSION_COOKIE_NAME,
  encodeSession = (x:SessionType) => x,
  decodeSession = (x:SessionType) => x
}:FooSessionCookiesConfig<SessionType>) {
  return ({ cookies, secretKey }:FooAuthSessionInitArg):FooAuthSession<SessionType> => ({
    clearSession() {
      cookies.set(sessionName, null);
    },

    getSessionToken() {
      return undefined;
    },

    async getSession() {
      const encrypted = cookies.get(sessionName) ?? '';

      try {
        const decrypted = decryptString({ encrypted, secretKey })

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
      const encrypted = encryptString({
        text: JSON.stringify(data),
        secretKey
      });

      cookies.set(sessionName, encrypted);

      return encrypted;
    },
  });
};
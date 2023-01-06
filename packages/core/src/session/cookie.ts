import { encrypt, decrypt } from '../encryption/string';
import type { FooSessionInitArg, FooSession } from '../internals';


export const SESSION_COOKIE_NAME = 'foo-auth:session';

export function sessionCookie<T = any>() {
  return ({ 
    sessionName = SESSION_COOKIE_NAME, 
    cookies, 
    secret
  }:FooSessionInitArg):FooSession<T> => ({
    clearSession() {
      cookies.set(sessionName, null);
    },

    getSessionToken() {
      return undefined;
    },

    getSession() {
      const encrypted = cookies.get(sessionName) ?? '';

      try {
        const decrypted = decrypt({ encrypted, secret })

        return decrypted ? JSON.parse(decrypted) as T : null;
      } catch (e) {
        return null; // failed to parse cookie, assume invalid session
      }
    },

    setSession(session) {
      const encrypted = encrypt({
        text: JSON.stringify(session),
        secret
      });

      cookies.set(sessionName, encrypted);

      return encrypted;
    },
  });
};
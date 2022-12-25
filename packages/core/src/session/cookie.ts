import { encrypt, decrypt } from '../encryption/string';
import type { FooSessionInitArg, FooSession } from '../internals';


export const SESSION_COOKIE_NAME = 'foo-auth:session';

export function sessionCookie<T = any>() {
  return ({ cookies, secret }:FooSessionInitArg):FooSession<T> => {
    return {
      clearSession() {
        cookies.set(SESSION_COOKIE_NAME, null);
      },

      getSession() {
        const encrypted = cookies.get(SESSION_COOKIE_NAME) ?? '';

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

        cookies.set(SESSION_COOKIE_NAME, encrypted);

        return encrypted;
      },
    };
  };
};
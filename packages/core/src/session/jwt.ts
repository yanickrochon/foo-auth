import { encrypt, decrypt } from '../encryption/string';
import type { FooSessionInitArg, FooSession } from '../internals';

export const JWT_HEADER_NAME = 'x-authorized';

export function sessionCookie<T = any>() {
  return ({ 
    req, 
    secret
  }:FooSessionInitArg):FooSession<T> => ({
    clearSession() {
      /* nothing */
    },

    getSessionToken() {
      return req.headers[JWT_HEADER_NAME] as string || undefined;
    },
    
    getSession() {
      const encrypted = req.headers[JWT_HEADER_NAME] as string;

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

      return encrypted;
    },
  });
};
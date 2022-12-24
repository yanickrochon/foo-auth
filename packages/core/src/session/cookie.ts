import type { FooSessionInitArg, FooSession } from '../internals';


export const SESSION_COOKIE_NAME = 'foo-auth:session';

export function sessionCookie<T = any>() {
  return ({ cookies }:FooSessionInitArg):FooSession<T> => {
    return {
      getSession() {
        const value = cookies.get(SESSION_COOKIE_NAME);

        try {
          return value ? JSON.parse(value) as T : null;
        } catch (e) {
          return null; // failed to parse cookie, assume invalid session
        }
      },

      setSession(session) {
        cookies.set(SESSION_COOKIE_NAME, JSON.stringify(session));

        return true;
      },
    };
  };
};
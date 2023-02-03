//import * as jose from 'jose';

import { encryptString, decryptString } from '../encryption/string';

import type {
  FooAuthSessionInitArg,
  FooAuthSession,
  FooAuthSessionConfig,
} from '../types';



export type FooSessionCookiesConfig<SessionType, SessionSnapshot = any> = {
  sessionName?:string;
} & FooAuthSessionConfig<SessionType, SessionSnapshot>;

export const DEFAULT_SESSION_COOKIE_NAME = 'foo-auth:session';


const defaultSaveSession = <SessionType, SessionSnapshot> (x:SessionType):SessionSnapshot => x as any;
const defaultRestoreSession = <SessionType, SessionSnapshot> (x:SessionSnapshot):SessionType => x as any;


export function sessionCookie<SessionType>({
  sessionName = DEFAULT_SESSION_COOKIE_NAME,
  saveSession = defaultSaveSession,
  restoreSession = defaultRestoreSession,
}:FooSessionCookiesConfig<SessionType> = {}) {
  return ({ cookies, secretKey }:FooAuthSessionInitArg<SessionType>):FooAuthSession<SessionType> => ({
    clearSession() {
      cookies.set(sessionName, null);
    },

    hasSession() {
      return !!cookies.get(sessionName);
    },

    getSessionToken() {
      // do not expore cookie
      return undefined;
    },

    async getSession() {
      const encrypted = cookies.get(sessionName) ?? '';
      let sessionValue = null;

      try {
        const snapshot = decryptString({ encrypted, secretKey });
        
        if (snapshot) {
          sessionValue = restoreSession(JSON.parse(snapshot as any))
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error(e);
        }
      }

      return sessionValue;
    },

    async setSession(payload) {
      const snapshot = saveSession(payload);
      const token = encryptString({text: JSON.stringify(snapshot), secretKey });

      cookies.set(sessionName, token);

      // do not expore cookie
      return undefined;
    },
  });
};
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


const defaultSaveSession = <SessionType> (x:SessionType):any => x;
const defaultRestoreSession = <SessionType> (x:any):SessionType => x as SessionType;


export function sessionCookie<SessionType>({
  sessionName = DEFAULT_SESSION_COOKIE_NAME,
  saveSession = defaultSaveSession,
  restoreSession = defaultRestoreSession,
}:FooSessionCookiesConfig<SessionType> = {}) {
  return ({ cookies, secretKey }:FooAuthSessionInitArg<SessionType>):FooAuthSession<SessionType> => ({
    clearSession() {
      cookies.set(sessionName, null);
    },

    getSessionToken() {
      return cookies.get(sessionName);
    },

    async getSession() {
      const encrypted = cookies.get(sessionName) ?? '';

      try {
        const snapshot = decryptString({ encrypted, secretKey });
        
        if (snapshot) {
          return restoreSession(JSON.parse(snapshot as any))
        } else {
          return null;
        }
      } catch (e) {
        return null; // failed to parse cookie or session snapshot, assume invalid session
      }
    },

    async setSession(payload) {
      const snapshot = saveSession(payload);
      const token = encryptString({text: JSON.stringify(snapshot), secretKey });

      cookies.set(sessionName, token);

      return token;
    },
  });
};
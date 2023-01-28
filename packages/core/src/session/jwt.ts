import { jwtEncode, jwtDecode } from '../encryption/jwt';

import type {
  FooAuthSessionInitArg,
  FooAuthSession,
  FooAuthSessionConfig,
  FooAuthApiRequest
} from '../types';



export type FooSessionJwtConfig<SessionType, SessionSnapshot = any> = {
  issuer:string;
  audience:string;
  maxTokenAge:string;
} & FooAuthSessionConfig<SessionType, SessionSnapshot>;


export const JWT_HEADER_NAME = 'Authorization';



const getToken = (req:FooAuthApiRequest) => {
  const jwtToken = req.headers[JWT_HEADER_NAME] as string;

  if (jwtToken) {
    return jwtToken.replace('Bearer ', '');
  } else {
    return undefined;
  }
};


const defaultSaveSession = <SessionType> (x:SessionType):any => x;
const defaultRestoreSession = <SessionType> (x:any):SessionType => x as SessionType;


export function sessionJwt<SessionType, SessionSnapshot = any>({
  issuer,
  audience,
  maxTokenAge,
  saveSession = defaultSaveSession,
  restoreSession = defaultRestoreSession,
}:FooSessionJwtConfig<SessionType, SessionSnapshot>) {
  return ({ req, secretKey }:FooAuthSessionInitArg<SessionType>):FooAuthSession<SessionType> => ({
    clearSession() {
      /* nothing */
    },

    getSessionToken() {
      return getToken(req);
    },
    
    async getSession() {
      const jwtToken = getToken(req);

      if (jwtToken) {
        const result = await jwtDecode(jwtToken, secretKey, { issuer, audience });

        if (result?.payload) {
          return restoreSession(result.payload as any);
        } else {
          return null;
        }
      } else {
        return null;
      }
    },

    async setSession(payload) {
      const snapshot = saveSession(payload);

      return jwtEncode(snapshot as any, secretKey, { issuer, audience, maxTokenAge });
    },
  });
};
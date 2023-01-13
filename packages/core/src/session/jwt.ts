import { jwtEncode, jwtDecode } from '../encryption/jwt';

import type { FooSessionInitArg, FooSessionConfig, FooSession, FooAuthApiRequest } from '../types';



export type FooSessionJwtConfig<SessionType> = {
  issuer:string;
  audience:string;
  maxTokenAge:string;
} & FooSessionConfig<SessionType>;


export const JWT_HEADER_NAME = 'Authorization';



const getToken = (req:FooAuthApiRequest) => {
  const token = req.headers[JWT_HEADER_NAME] as string;

  if (token) {
    return token.replace('Bearer ', '');
  } else {
    return undefined;
  }
};


export function sessionJwt<SessionType = any>({
  issuer,
  audience,
  maxTokenAge,
  encodeSession = (x:SessionType) => x,
  decodeSession = (x:SessionType) => x
}:FooSessionJwtConfig<SessionType>) {
  return ({ req, secretKey }:FooSessionInitArg):FooSession<SessionType> => ({
    clearSession() {
      /* nothing */
    },

    getSessionToken() {
      return getToken(req);
    },
    
    async getSession() {
      const token = getToken(req);

      if (token) {
        const result = await jwtDecode(token, secretKey, { issuer, audience });

        if (result?.payload) {
          const payload = await decodeSession(result.payload as any);
  
          return payload;
        } else {
          return null;
        }
      } else {
        return null;
      }
    },

    async setSession(payload) {
      const data = await encodeSession(payload);

      return jwtEncode(data, secretKey, { issuer, audience, maxTokenAge });
    },
  });
};
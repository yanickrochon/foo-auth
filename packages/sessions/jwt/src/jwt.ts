import {
  jwtEncode,
  jwtDecode,
  type FooAuthSessionInitOptions,
  type FooAuthSession,
  type FooAuthSessionConfig,
  type FooAuthApiRequest,
} from "@foo-auth/core";

export type FooSessionJwtConfig<SessionType, SessionSnapshot = any> = {
  issuer: string;
  audience: string;
  maxTokenAge: string;
} & FooAuthSessionConfig<SessionType, SessionSnapshot>;

export const JWT_HEADER_NAME = "Authorization";

const getToken = (req: FooAuthApiRequest) => {
  const jwtToken = req.headers[JWT_HEADER_NAME] as string;

  if (jwtToken) {
    return jwtToken.replace("Bearer ", "");
  } else {
    return undefined;
  }
};

const defaultSaveSession = <SessionType, SessionSnapshot>(
  x: SessionType
): SessionSnapshot => x as any;
const defaultRestoreSession = <SessionType, SessionSnapshot>(
  x: SessionSnapshot
): SessionType => x as any;

export function sessionJwt<SessionType, SessionSnapshot = any>({
  issuer,
  audience,
  maxTokenAge,
  saveSession = defaultSaveSession,
  restoreSession = defaultRestoreSession,
}: FooSessionJwtConfig<SessionType, SessionSnapshot>) {
  return ({
    req,
    secretKey,
  }: FooAuthSessionInitOptions<SessionType>): FooAuthSession<SessionType> => ({
    secretKey,

    clearSession() {
      /* nothing */
    },

    hasSession() {
      return !!getToken(req);
    },

    getSessionToken() {
      return getToken(req);
    },

    async getSession() {
      const jwtToken = getToken(req);
      let sessionValue = null;

      if (jwtToken) {
        try {
          const result = await jwtDecode(jwtToken, secretKey, {
            issuer,
            audience,
          });

          if (result?.payload) {
            sessionValue = restoreSession(result.payload as any);
          }
        } catch (e) {
          if (process.env.NODE_ENV === "development") {
            console.error(e);
          }
        }
      }

      return sessionValue;
    },

    async setSession(payload) {
      const snapshot = saveSession(payload);

      return jwtEncode(snapshot as any, secretKey, {
        issuer,
        audience,
        maxTokenAge,
      });
    },
  });
}

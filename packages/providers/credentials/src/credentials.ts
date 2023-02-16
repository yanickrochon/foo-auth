import {
  getRedirect,
  clearRedirect,
  verifyCSRFToken,
  type FooAuthProviderInitOptions,
  type FooAuthEndpoints,
  type FooAuthProvider,
  type FooAuthApiSessionResponse,
} from "@foo-auth/core";

const DEFAULT_NAME = "credentials";

const REDIRECT_JOIN_STR = "\n";

export type CredentialsProviderInitOptions<Credentials, SessionType> =
  FooAuthProviderInitOptions<Credentials, SessionType>;

export function credentials<Credentials, SessionType>({
  name = DEFAULT_NAME,
  authenticate,
}: CredentialsProviderInitOptions<
  Credentials,
  SessionType
>): FooAuthProvider<SessionType> {
  return (endpointPath: FooAuthEndpoints) => ({
    [`${endpointPath.signIn}/${name}`]: async ({ req, res, session }) => {
      if (req.method === "POST") {
        const { csrfToken, ...credentials } = req.body;
        const { r: redirect } = req.query;
        const token = Array.isArray(csrfToken)
          ? csrfToken.join("")
          : (csrfToken as string);

        if (verifyCSRFToken({ token })) {
          const sessionValue = await authenticate(credentials as Credentials);

          if (sessionValue) {
            const token = await session.setSession(sessionValue);
            const data: FooAuthApiSessionResponse<SessionType> = {
              success: true,
              token,
              session: sessionValue,
            };

            if (Array.isArray(redirect)) {
              data.redirect = redirect.join(REDIRECT_JOIN_STR);
            } else if (redirect) {
              data.redirect = redirect;
            } else {
              const cookieRedirect = getRedirect(req);

              if (cookieRedirect) {
                clearRedirect(req);
                data.redirect = cookieRedirect;
              }
            }

            res.status(200).send(data);
          } else {
            res.status(403).end();
          }
        } else {
          res.status(401).end();
        }
      } else {
        res.status(405).end();
      }
    },
  });
}

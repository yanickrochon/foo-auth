import {
  verifyCSRFToken,
  type FooAuthProviderInitOptions,
  type FooAuthApiResponseValue,
  type FooAuthEndpoints,
  type FooAuthProvider,
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
      const { csrfToken, ...credentials } = req.body;
      const { r: redirect } = req.query;
      const token = Array.isArray(csrfToken)
        ? csrfToken.join("")
        : (csrfToken as string);

      if (verifyCSRFToken({ token })) {
        const sessionValue = await authenticate(credentials as Credentials);

        if (sessionValue) {
          const token = await session.setSession(sessionValue);

          res.status(200).send({
            success: true,
            token,
            session: sessionValue,
            redirect: Array.isArray(redirect)
              ? redirect.join(REDIRECT_JOIN_STR)
              : (redirect as string),
          });
        } else {
          res.status(403).end();
        }
      } else {
        res.status(401).end();
      }
    },
  });
}

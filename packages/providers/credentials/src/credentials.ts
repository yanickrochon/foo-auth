import {
  verifyCSRFToken,

  type FooAuthEndpoints,
  type FooAuthProvider
} from "@foo-auth/core";


export type CredentialsOptions<Credentials, SessionType = any> = {
  name?:string;
  authenticate(credentials:Credentials):SessionType | null | PromiseLike<SessionType | null>;
};

const DEFAULT_NAME = "credentials";


export function credentials<Credentials, SessionType>({
  name = DEFAULT_NAME,
  authenticate
}:CredentialsOptions<Credentials, SessionType>):FooAuthProvider<SessionType> {
  return (endpointPath:FooAuthEndpoints) => ({
    [`${endpointPath.signIn}/${name}`]: async ({ req, res, session }) => {
      const { csrfToken, ...credentials } = req.body;
      const { r:redirect } = req.query;
      const token = Array.isArray(csrfToken) ? csrfToken.join('') : csrfToken as string;

      if (verifyCSRFToken({ token })) {
        const sessionValue = await authenticate(credentials as Credentials);
        
        if (sessionValue) {
          const token = await session.setSession(sessionValue);

          if (redirect) {
            // TODO : if JWT, add token to redirect!!

            res.redirect(307, Array.isArray(redirect) ? redirect[0] : redirect);
          } else {
            res.status(200).send({
              success: true,
              session: sessionValue,
              token
            } as any);
          }
        } else {
          res.status(403).end();
        }
      } else {
        res.status(401).end();
      }
    }
  });
};
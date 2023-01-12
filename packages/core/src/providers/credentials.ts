import { verifyCSRFToken } from "../encryption/csrf";

import type { FooAuthEndpointsConfig, FooAuthProvider } from "../internals";


type CredentialsBase = {
  [key:string]: string;
}

export type CredentialsOptions<Credentials extends CredentialsBase, SessionType = any> = {
  name?:string;
  authenticate(credentials:Credentials):SessionType | null | PromiseLike<SessionType | null>;
};

const DEFAULT_NAME = "credentials";


export function credentials<Credentials extends CredentialsBase, SessionType>(options:CredentialsOptions<Credentials, SessionType>):FooAuthProvider<SessionType> {
  return (endpointPath:FooAuthEndpointsConfig) => ({
    [`${endpointPath.signIn}/${options.name ?? DEFAULT_NAME}`]: async ({ req, res, session }) => {
      const { csrfToken, ...credentials } = req.body;
      const { redirect } = req.query;
      const token = Array.isArray(csrfToken) ? csrfToken.join('') : csrfToken as string;

      if (verifyCSRFToken({ token })) {
        const sessionValue = await options.authenticate(credentials as Credentials);

        if (sessionValue) {
          if (redirect) {
            res.redirect(307, Array.isArray(redirect) ? redirect[0] : redirect);
          } else {
            const token = await session.setSession(sessionValue);

            res.status(200).send({
              success: true,
              session: sessionValue,
              token
            });
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
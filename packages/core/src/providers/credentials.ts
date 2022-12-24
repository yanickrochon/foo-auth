import { verifyCSRFToken } from "../encryption/csrf";

import type { FooAuthConfigRoutePrefix, FooAuthApiRoutes } from "../internals";
import type { ProviderRouteResponse } from './';


type CredentialsBase = {
  [key:string]: string;
}

export type CredentialsOptions<Credentials extends CredentialsBase, SessionType = any> = {
  name?:string;
  authenticate(credentials:Credentials):Promise<ProviderRouteResponse<SessionType>>;
};

const DEFAULT_NAME = "credentials";


export type FooAuthApiInitRoutes<SessionType> = {
  (routePrefix:FooAuthConfigRoutePrefix):FooAuthApiRoutes<SessionType>;
}

export type CredentialsProvider<SessionType, Credentials extends CredentialsBase> = {
  (options:CredentialsOptions<Credentials, SessionType>):FooAuthApiInitRoutes<SessionType>;
};



export function credentials<Credentials extends CredentialsBase, SessionType>(options:CredentialsOptions<Credentials, SessionType>):FooAuthApiInitRoutes<SessionType> {
  return (baseRoutes:FooAuthConfigRoutePrefix) => ({
    [`${baseRoutes.signIn}/${options.name ?? DEFAULT_NAME}`]: async ({ req, res, config, session }) => {
      const { csrfToken, ...credentials } = req.body;
      const { secret } = config;
      const token = Array.isArray(csrfToken) ? csrfToken.join('') : csrfToken as string;

      if (verifyCSRFToken({ token, secret })) {
        const response = await options.authenticate(credentials as Credentials);

        if (response.type === "redirect") {
          res.redirect(307, response.path);
        } else if (response.message) {
          const token = session.setSession(response.message);

          res.status(200).send({
            success:response.success,
            session: response.message,
            token
          });
        } else {
          res.status(500).end();
        }
      } else {
        res.status(401).end();
      }
    }
  });
};
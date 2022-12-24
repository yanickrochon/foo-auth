import { verifyCSRFToken } from "../encryption/csrf";

import type { FooAuthConfigRoutePrefix, FooAuthApiRoutes } from "../internals";
import type { ProviderRouteResponse } from './';


type CredentialsBase = {
  [key:string]: string;
}

export type CredentialsOptions<Credentials extends CredentialsBase, T = any> = {
  name?:string;
  authenticate(credentials:Credentials):Promise<ProviderRouteResponse<T>>;
};

const DEFAULT_NAME = "credentials";


export type FooAuthApiInitRoutes<SessionType> = {
  (routePrefix:FooAuthConfigRoutePrefix):FooAuthApiRoutes<SessionType>;
}

export type CredentialsProvider<SessionType, Credentials extends CredentialsBase> = {
  (options:CredentialsOptions<Credentials>):FooAuthApiInitRoutes<SessionType>;
};



export function credentials<SessionType, Credentials extends CredentialsBase>(options:CredentialsOptions<Credentials>):FooAuthApiInitRoutes<SessionType> {
  return (baseRoutes:FooAuthConfigRoutePrefix) => ({
    [`${baseRoutes.signIn}/${options.name ?? DEFAULT_NAME}`]: async ({ req, res, config }) => {
      const { csrfToken, ...credentials } = req.body;
      const { secret } = config;
      const token = Array.isArray(csrfToken) ? csrfToken.join('') : csrfToken as string;

      if (verifyCSRFToken({ token, secret })) {
        const response = await options.authenticate(credentials as Credentials);

        if (response.type === "redirect") {
          res.redirect(307, response.path);
        } else {
          res.status(200).send({
            success:response.success,
            message:response.message
          });
        }
      } else {
        res.status(401).end();
      }
    }
  });
};
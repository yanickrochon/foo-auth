import type { FooAuthConfig, FooAuthConfigRoutePrefix } from './internals';

import { sessionRoutes } from './api/session';
import { csrfRoutes } from './api/csrf';


const defaultBaseRoutes:FooAuthConfigRoutePrefix = {
  callback: '/callback',
  csrfToken: '/csrf-token',
  session: '/session',
  signIn: '/sign-in',
  signOut: '/sign-out',
}


export function getRoutes<SessionType>(config:FooAuthConfig<SessionType>) {
  const baseRoutes = {
    ...defaultBaseRoutes,
    ...config.baseRoutes
  };

  const routes = {
    ...sessionRoutes(baseRoutes),
    ...csrfRoutes(baseRoutes)
  };

  // register routes
  if (config.providers) {
    for (const providerInit of config.providers) {
      const provider = providerInit(baseRoutes);

      for (const routePath in provider) {
        if (routePath in routes) {
          throw new Error(`Duplicate route : ${routePath}`);
        }
       
        routes[routePath] = provider[routePath];
      }
    }
  }

  return routes;
};

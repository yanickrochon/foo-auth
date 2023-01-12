import type { FooAuthConfig, FooAuthEndpointsConfig } from './internals';

import { authEndpoints } from './api/auth';
import { sessionEndpoints } from './api/session';
import { csrfEndpoints } from './api/csrf';


const defaultBaseEndpoints:FooAuthEndpointsConfig = {
  callback: '/callback',
  csrfToken: '/csrf-token',
  session: '/session',
  signIn: '/sign-in',
  signOut: '/sign-out',
}


export function getEndpoints<SessionType>(config:FooAuthConfig<SessionType>) {
  const endpointPath = {
    ...defaultBaseEndpoints,
    ...config.endpointPath
  };

  const endpoints = {
    ...authEndpoints(endpointPath),
    ...sessionEndpoints(endpointPath),
    ...csrfEndpoints(endpointPath)
  };

  // register routes
  if (config.providers) {
    for (const providerInit of config.providers) {
      const provider = providerInit(endpointPath);

      for (const path in provider) {
        if (path in endpoints) {
          throw new Error(`Duplicate endpoint path : ${path}`);
        }
       
        endpoints[path] = provider[path];
      }
    }
  }

  return endpoints;
};

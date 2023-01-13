import { authEndpoints } from './api/auth';
import { sessionEndpoints } from './api/session';
import { csrfEndpoints } from './api/csrf';

import type { FooAuthProvider, FooAuthEndpointsConfig } from './types';



const defaultBaseEndpoints:FooAuthEndpointsConfig = {
  callback: '/callback',
  csrfToken: '/csrf-token',
  session: '/session',
  signIn: '/sign-in',
  signOut: '/sign-out',
}



export type GetEndpointArgs<SessionType> = {
  endpointPath?:FooAuthEndpointsConfig;
  providers:FooAuthProvider<SessionType>[]
}


export function getEndpoints<SessionType>({
  endpointPath,
  providers
}:GetEndpointArgs<SessionType>) {
  const localEndpointPath = {
    ...defaultBaseEndpoints,
    ...endpointPath
  };

  const endpoints = {
    ...authEndpoints(localEndpointPath),
    ...sessionEndpoints(localEndpointPath),
    ...csrfEndpoints(localEndpointPath)
  };

  // register routes
  if (providers) {
    for (const providerInit of providers) {
      const provider = providerInit(localEndpointPath);

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

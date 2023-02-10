import { authEndpoints } from "./api/auth";
import { sessionEndpoints } from "./api/session";
import { csrfEndpoints } from "./api/csrf";

import type { FooAuthProvider, FooAuthEndpoints } from "./types";

export type GetEndpointArgs<SessionType> = {
  endpointPaths: FooAuthEndpoints;
  providers: FooAuthProvider<SessionType>[];
};

export function getEndpoints<SessionType>({
  endpointPaths,
  providers,
}: GetEndpointArgs<SessionType>) {
  const endpoints = {
    ...authEndpoints(endpointPaths),
    ...sessionEndpoints(endpointPaths),
    ...csrfEndpoints(endpointPaths),
  };

  // register routes
  if (providers) {
    for (const providerInit of providers) {
      const provider = providerInit(endpointPaths);

      for (const path in provider) {
        if (path in endpoints) {
          throw new Error(`Duplicate endpoint path : ${path}`);
        }

        endpoints[path] = provider[path];
      }
    }
  }

  return endpoints;
}

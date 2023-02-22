import { authEndpoints } from "./api/auth";
import { sessionEndpoints } from "./api/session";
import { csrfEndpoints } from "./api/csrf";

import type { FooAuthProvider, FooAuthEndpoints } from "./types";

export type GetEndpointOptions<SessionType> = {
  endpointPaths?: FooAuthEndpoints;
  providers: FooAuthProvider<SessionType>[];
};

const DEFAULT_ENDPOINTS: FooAuthEndpoints = {
  callback: "/callback", // the return URL for external providers
  csrfToken: "/csrf-token", // the
  session: "/session",
  signIn: "/sign-in",
  signOut: "/sign-out",
};

export function getEndpoints<SessionType>({
  endpointPaths,
  providers,
}: GetEndpointOptions<SessionType>) {
  endpointPaths = Object.assign<FooAuthEndpoints, FooAuthEndpoints>(
    DEFAULT_ENDPOINTS,
    endpointPaths || {}
  );
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

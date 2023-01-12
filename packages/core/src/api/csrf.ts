import { createCSRFToken } from '../encryption/csrf';

import type { FooAuthEndpoints, FooAuthEndpointsConfig } from '../internals';

export function csrfEndpoints<SessionType>(endpointPath:FooAuthEndpointsConfig):FooAuthEndpoints<SessionType> {
  return {
    [endpointPath.csrfToken as string]: ({ res }) => {
      const csrfToken = createCSRFToken();

      res.status(200).send({ csrfToken });
    }
  }
}
import { createCSRFToken } from '../encryption/csrf';

import type { FooAuthEndpointHandlers, FooAuthEndpoints } from '../types';

export function csrfEndpoints<SessionType>(endpointPath:FooAuthEndpoints):FooAuthEndpointHandlers<SessionType> {
  return {
    [endpointPath.csrfToken as string]: ({ res }) => {
      const csrfToken = createCSRFToken();

      res.status(200).send({ csrfToken });
    }
  }
}
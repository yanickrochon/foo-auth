import { createCSRFToken } from '../encryption/csrf';

import type {
  FooAuthEndpointHandlers,
  FooAuthEndpoints,
} from '../types';

export function csrfEndpoints<SessionType>({ csrfToken }:FooAuthEndpoints):FooAuthEndpointHandlers<SessionType> {
  return {
    [csrfToken]: ({ res }) => {
      const csrfToken = createCSRFToken();

      res.status(200).send({ csrfToken });
    }
  }
}
import { createCSRFToken } from '../encryption/csrf';

import type { FooAuthApiRoutes, FooAuthConfigRoutePrefix } from '../internals';

export function csrfRoutes<SessionType>(baseRoutes:FooAuthConfigRoutePrefix):FooAuthApiRoutes<SessionType> {
  return {
    [baseRoutes.csrfToken as string]: ({ res }) => {
      const csrfToken = createCSRFToken();

      res.status(200).send({ csrfToken });
    }
  }
}
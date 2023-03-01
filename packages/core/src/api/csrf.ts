import { createCSRFToken } from "../encryption/csrf";

import type { FooAuthEndpointHandlers, FooAuthEndpoints } from "../types";

export function csrfEndpoints<SessionType>({
  csrfToken,
}: FooAuthEndpoints): FooAuthEndpointHandlers<SessionType> {
  return csrfToken
    ? {
        [csrfToken]: ({ req, res }) => {
          if (req.method === "GET") {
            const csrfToken = createCSRFToken();

            res.status(200).send({ csrfToken });
          } else {
            res.status(405).end();
          }
        },
      }
    : {};
}

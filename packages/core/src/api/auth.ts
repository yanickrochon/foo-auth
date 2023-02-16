import { verifyCSRFToken } from "../encryption/csrf";

import type { FooAuthEndpointHandlers, FooAuthEndpoints } from "../types";

export function authEndpoints<SessionType = any>({
  signOut,
}: FooAuthEndpoints): FooAuthEndpointHandlers<SessionType> {
  return {
    [signOut]: async ({ req, res, session }) => {
      if (req.method === "POST") {
        const { csrfToken } = req.body;
        const token = Array.isArray(csrfToken)
          ? csrfToken.join("")
          : (csrfToken as string);

        if (verifyCSRFToken({ token })) {
          await session.clearSession();

          res.status(200).send({
            success: true,
          });
        } else {
          res.status(401).end();
        }
      } else {
        res.status(405).end();
      }
    },
  };
}

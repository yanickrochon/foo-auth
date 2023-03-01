import { setRedirect } from "../util/redirect";

import type {
  FooAuthEndpointHandlers,
  FooAuthEndpoints,
  FooAuthApiSessionResponse,
} from "../types";

export function sessionEndpoints<SessionType>({
  session,
}: FooAuthEndpoints): FooAuthEndpointHandlers<SessionType> {
  return session
    ? {
        [session]: async ({ req, res, session }) => {
          if (req.method === "GET") {
            const sessionToken = await session.getSessionToken();
            const sessionValue = await session.getSession();
            const response: FooAuthApiSessionResponse<SessionType> = {
              success: true,
              token: sessionToken,
              session: sessionValue,
            };

            res.status(200).send(response);
          } else {
            res.status(405).end();
          }
        },
      }
    : {};
}

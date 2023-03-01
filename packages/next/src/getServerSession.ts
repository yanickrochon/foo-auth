import { serverApiAdapter } from "./server-adapter";

import type { NextApiRequest, NextApiResponse } from "next";
import type { FooAuthSession } from "@foo-auth/core";
import type { NextFooAuthOptions } from "./types";

export const getServerSession = <SessionType>(
  req: NextApiRequest,
  res: NextApiResponse,
  { session, secretKey }: NextFooAuthOptions<SessionType>
): FooAuthSession<SessionType> => {
  return session({ ...serverApiAdapter<SessionType>(req, res), secretKey });
};

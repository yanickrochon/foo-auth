import { serverApiAdapter } from "./server-adapter";

import type { NextApiRequest, NextApiResponse } from "next";
import type { NextFooAuthOptions } from "./types";

export const getServerSession = async <SessionType>(
  req: NextApiRequest,
  res: NextApiResponse,
  { session, secretKey }: NextFooAuthOptions<SessionType>
): Promise<SessionType | null> => {
  return session({
    ...serverApiAdapter<SessionType>(req, res),
    secretKey,
  }).getSession();
};

import { Cookies } from "@foo-auth/core";

import { serverPageAdapter } from "./server-adapter";
import type { IncomingMessage, ServerResponse } from "http";

import type { NextFooAuthConfig } from "./types";

type GetServerSession<SessionType> = {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
  config: NextFooAuthConfig<SessionType>;
};

export async function getServerSession<SessionType>({
  req: _req,
  res: _res,
  config,
}: GetServerSession<SessionType>) {
  const { req, res } = serverPageAdapter(_req, _res);
  const cookies = new Cookies(_req, _res);
  const session = config.session({
    req,
    res,
    cookies,
    secretKey: config.secretKey,
  });

  return session.getSession();
}

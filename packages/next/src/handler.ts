import { getEndpoints } from "@foo-auth/core";

import { serverApiAdapter } from "./server-adapter";

import { getServerSession } from "./getServerSession";

import type { NextApiRequest, NextApiResponse } from "next";
import type { NextFooAuthOptions } from "./types";

export function fooAuthNext<SessionType = any>({
  session,
  providers,
  endpointPaths,
  //pages,
  secretKey,
}: NextFooAuthOptions<SessionType>) {
  const endpoints = getEndpoints({
    endpointPaths,
    providers,
  });

  return async (_req: NextApiRequest, _res: NextApiResponse) => {
    const { auth: params = [] } = _req.query || {};
    const path = Array.isArray(params)
      ? `/${params.join("/")}`
      : (params as string);
    const endpoint = endpoints[path];

    if (endpoint) {
      const { req, res } = serverApiAdapter<SessionType>(_req, _res);

      await endpoint({
        req,
        res,
        session: session({ req, res, secretKey }),
      });
    }

    if (!_res.headersSent) {
      _res.status(404).end();
    }
  };
}

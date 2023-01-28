import {
  Cookies,
  getEndpoints
} from '@foo-auth/core';

import { serverApiAdapter } from './server-adapter';

import type { NextApiRequest, NextApiResponse } from "next";
import type { NextFooAuthConfig } from './types';


export function fooAuthNext<SessionType = any>({
  session,
  providers,
  endpointPaths,
  secretKey
}:NextFooAuthConfig<SessionType>) {
  const endpoints = getEndpoints({
    endpointPaths,
    providers
  });

  return async (_req:NextApiRequest, _res:NextApiResponse) => {
    const { auth:params = [] } = _req.query || {};
    const path = (Array.isArray(params) ? `/${params.join('/')}` : params as string);
    const endpoint = endpoints[path];

    if (endpoint) {
      const { req, res } = serverApiAdapter<SessionType>(_req, _res);
      const cookies = new Cookies(_req, _res);
  
      await endpoint({
        req,
        res,
        cookies,
        session: session({ req, res, cookies, secretKey }) as any,
        secretKey
      });
    }

    if (!_res.headersSent) {
      _res.status(404).end();
    }
  };
};
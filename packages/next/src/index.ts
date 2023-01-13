import {
  validateSecret,
  Cookies,
  getEndpoints,
  FooSessionInit,
  FooAuthProvider,
  FooAuthEndpointsConfig
} from '@foo-auth/core';

import { serverAdapter } from './server-adapter';

import type { NextApiRequest, NextApiResponse } from "next";


export type NextFooAuthConfig<SessionType> = {
  session:FooSessionInit<SessionType>;
  providers:FooAuthProvider<SessionType>[];
  endpointPath?:FooAuthEndpointsConfig;
  secret:string;
};


export default function fooAuthNext<SessionType = any>({
  session,
  providers,
  endpointPath,
  secret
}:NextFooAuthConfig<SessionType>) {
  const secretKey = validateSecret(secret);
  const endpoints = getEndpoints({
    endpointPath,
    providers
  });

  return async (_req:NextApiRequest, _res:NextApiResponse) => {
    const { auth:params = [] } = _req.query || {};
    const path = (Array.isArray(params) ? `/${params.join('/')}` : params as string);
    const endpoint = endpoints[path];

    if (endpoint) {
      const { req, res } = serverAdapter(_req, _res);
      const cookies = new Cookies(_req, _res);
  
      await endpoint({
        req,
        res,
        cookies,
        session: session({ req, res, cookies, secretKey }),
        secretKey
      });
    }

    if (!_res.headersSent) {
      _res.status(404).end();
    }
  };
};
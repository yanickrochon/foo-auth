import type { NextApiRequest, NextApiResponse } from "next";
import {
  getEndpoints,
  FooAuthConfig,
  FooAuthServerAdapter,
  FooAuthApiRequest,
  FooAuthApiResponse,
  Cookies
} from '@foo-auth/core';

import { validateSecret } from '@foo-auth/core';


type NextFooAuthServerAdapter = FooAuthServerAdapter<NextApiRequest, NextApiResponse>;

export default function fooAuthNext<SessionType = any>(config:FooAuthConfig<SessionType>) {
  const secretKey = validateSecret(config.secret);

  const server:NextFooAuthServerAdapter = {
    getCookies(req:NextApiRequest, res:NextApiResponse) {
      return new Cookies(req, res);
    },
    getRequest(req:NextApiRequest) {
      return req as FooAuthApiRequest;
    },
    getResponse(res:NextApiResponse) {
      return res as FooAuthApiResponse;
    }  
  };

  const endpoints = getEndpoints(config);


  return async (_req:NextApiRequest, _res:NextApiResponse) => {
    const { auth:params = [] } = _req.query || {};
    const path = (Array.isArray(params) ? `/${params.join('/')}` : params as string);
    const endpoint = endpoints[path];

    if (endpoint) {
      const req = server.getRequest(_req);
      const res = server.getResponse(_res);
      const cookies = server.getCookies(_req, _res);
      const session = config.session({ req, res, cookies, secretKey });
  
      await endpoint({ req, res, config, cookies, session, secretKey });
    }

    if (!_res.headersSent) {
      _res.status(404).end();
    }
  };
};
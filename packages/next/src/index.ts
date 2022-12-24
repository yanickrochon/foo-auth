import type { NextApiRequest, NextApiResponse } from "next";
import {
  getRoutes,
  FooAuthConfig,
  FooAuthServerAdapter,
  FooAuthApiResponse,
  Cookies
} from '@foo-auth/core';


type NextFooAuthServerAdapter = FooAuthServerAdapter<NextApiRequest, NextApiResponse>;


export default function fooAuthNext<SessionType = any>(config:FooAuthConfig<SessionType>) {
  const server:NextFooAuthServerAdapter = {
    getCookies(req:NextApiRequest, res:NextApiResponse) {
      return new Cookies(req, res);
    },
    getRequest(req:NextApiRequest) {
      return {
        query: req.query,
        body: req.body
      };
    },
    getResponse(res:NextApiResponse) {
      const response:FooAuthApiResponse = {
        redirect(statusCode, url?) {
          if (typeof statusCode === 'string') {
            res.redirect(statusCode);
          } else {
            res.redirect(statusCode, url as string);
          }

          return response;
        },
        status(statusCode:number) {
          res.status(statusCode);
          return response;
        },
        send(body:any) {
          res.send(body);
          return response;
        },
        end(cb?:()=>void) {
          res.end(cb);
          return response;
        }
      };

      return response;
    }  
  };

  const apiRoutes = getRoutes(config);


  return async (_req:NextApiRequest, _res:NextApiResponse) => {
    const { auth:params = [] } = _req.query || {};
    const routeName = (Array.isArray(params) ? `/${params.join('/')}` : params as string);
    const routeFn = apiRoutes[routeName];

    //console.log(routeName, apiRoutes);

    if (routeFn) {
      const req = server.getRequest(_req);
      const res = server.getResponse(_res);
      const cookies = server.getCookies(_req, _res);
      const session = config.session({ req, res, cookies });
  
      await routeFn({ req, res, config, cookies, session });
    }

    if (!_res.headersSent) {
      _res.status(404).end();
    }
  };
};
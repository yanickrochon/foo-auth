import { Cookies, FooAuthEndpoints } from '@foo-auth/core';

import { serverPageAdapter } from './server-adapter';
import type { IncomingMessage, ServerResponse } from 'http';

import type { NextFooAuthConfig } from './types';


type GetPagePropsArg<SessionType> = {
  req:IncomingMessage;
  res:ServerResponse<IncomingMessage>;
  config:NextFooAuthConfig<SessionType>;
};

type GetPageProps<SessionType> = {
  session:SessionType | null;
  endpointsPath:FooAuthEndpoints;
}

export async function getPageProps<SessionType>({ req:_req, res:_res, config }:GetPagePropsArg<SessionType>):Promise<GetPageProps<SessionType>> {
  const { req, res } = serverPageAdapter(_req, _res);
  const cookies = new Cookies(_req, _res);
  const session = config.session({
    req,
    res,
    cookies,
    secretKey:config.secretKey
  });

  return {
    session: await session.getSession(),
    endpointsPath:config.endpointPath,
  };
}


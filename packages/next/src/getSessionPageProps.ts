import type { IncomingMessage, ServerResponse } from "http";

import { Cookies, FooAuthEndpoints } from "@foo-auth/core";

import { serverPageAdapter } from "./server-adapter";
import { getRedirect, setRedirect } from './util/redirect';

import type { GetServerSidePropsResult } from 'next';
import type { NextFooAuthConfig } from "./types";


export type SessionPagePropsArg<SessionType> = {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
  config: NextFooAuthConfig<SessionType>;
};

export type SessionPageProps<SessionType> = {
  session: SessionType | null;
  endpointPaths: FooAuthEndpoints;
};

export type SessionPagePropsCallback<SessionType> = {
  (sessionPageProps:SessionPageProps<SessionType>):Promise<{ props: any }>;
}

export async function getSessionPageProps<SessionType>({
  req: _req,
  res: _res,
  config,
}: SessionPagePropsArg<SessionType>, callback:SessionPagePropsCallback<SessionType>): Promise<GetServerSidePropsResult<any>> {
  const { req, res } = serverPageAdapter(_req, _res);
  const cookies = new Cookies(_req, _res);
  const session = config.session({
    req,
    res,
    cookies,
    secretKey: config.secretKey,
  });

  const hasSession = session.hasSession();
  let redirect = null; 

  //console.log( _req );

  if (hasSession) {
    redirect = getRedirect(cookies);
  } else if (config.pages?.signin) {
    //if (req.url && req.url !== config.pages.signin && req.url !== config.pages.signout && req.url !== config.pages.verify) {
    //  setRedirect(req.url, cookies);
    //}
    //redirect = config.pages.signin;
  }

  return redirect ? {
    redirect: {
      destination: redirect,
      permanent: false,
    } 
  } : callback({
    session: await session.getSession(),
    endpointPaths: config.endpointPaths,
  });
}

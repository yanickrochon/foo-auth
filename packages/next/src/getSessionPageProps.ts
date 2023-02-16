import {
  FooAuthEndpoints,
  clearRedirect,
  getRedirect,
  setRedirect,
} from "@foo-auth/core";

import { serverPageAdapter } from "./server-adapter";

import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { NextFooAuthConfig } from "./types";

export type SessionPagePropsOptions<SessionType> = {
  context: GetServerSidePropsContext;
  config: NextFooAuthConfig<SessionType>;
};

export type SessionPageProps<SessionType> = {
  session: SessionType | null;
  endpointPaths: FooAuthEndpoints;
};

export type SessionPagePropsCallback<SessionType> = {
  (sessionPageProps: SessionPageProps<SessionType>): Promise<{ props: any }>;
};

export async function getSessionPageProps<SessionType>(
  { context, config }: SessionPagePropsOptions<SessionType>,
  callback: SessionPagePropsCallback<SessionType>
): Promise<GetServerSidePropsResult<any>> {
  const { req, res } = serverPageAdapter(context);
  const session = config.session({
    req,
    res,
    secretKey: config.secretKey,
  });

  const hasSession = session.hasSession();
  let redirect = null;

  // assume that favicon.ico is missing if we see this
  if (req.url === "/favicon.ico") {
    return {
      notFound: true,
    };
  } else {
    const url = req.getURL();

    //console.log("***", hasSession, url?.pathname, config.pages?.signin);

    if (hasSession) {
      redirect = getRedirect(req);
      clearRedirect(req);
    } else if (
      url &&
      config.pages?.signin &&
      !url.pathname.startsWith(config.pages.signin)
    ) {
      setRedirect(url.href, req);
      redirect = `${url.origin}${url.basePath}${config.pages.signin}`;
    }

    return redirect
      ? {
          redirect: {
            statusCode: 307,
            destination: redirect,
            basePath: false,
          },
        }
      : callback({
          session: await session.getSession(),
          endpointPaths: config.endpointPaths,
        });
  }
}

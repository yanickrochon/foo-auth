import { ParsedUrlQuery } from "querystring";

import {
  FooAuthEndpoints,
  clearRedirect,
  getRedirect,
  setRedirect,
} from "@foo-auth/core";

import { serverPageAdapter } from "./server-adapter";

import type {
  PreviewData,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";

import type { NextFooAuthOptions } from "./types";

export type SessionProps<SessionType> = {
  session: SessionType | null;
  endpointPaths: FooAuthEndpoints;
};

export type GetServerSideAuthProps<
  SessionType,
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = (
  context: GetServerSidePropsContext<Q, D> & {
    sessionProps: SessionProps<SessionType>;
  }
) => Promise<GetServerSidePropsResult<P>>;

export function withServerSideAuthProps<SessionType>(
  options: NextFooAuthOptions<SessionType>,
  pagePropsHandler: GetServerSideAuthProps<SessionType>
) {
  return async (context: GetServerSidePropsContext) => {
    const { req, res } = serverPageAdapter(context);
    const session = options.session({
      req,
      res,
      secretKey: options.secretKey,
    });

    const userSession = await session.getSession();
    const hasSession = !!userSession;
    let redirect = null;

    // assume that favicon.ico is missing if we see this
    if (req.url === "/favicon.ico") {
      return {
        notFound: true,
      };
    } else {
      const url = req.getURL();

      if (hasSession) {
        redirect = getRedirect(req);
        clearRedirect(req);
      } else if (
        options.pages?.signin &&
        !url.pathname.startsWith(options.pages.signin)
      ) {
        setRedirect(url.href, req);
        redirect = options.pages.signin;
      }

      return redirect
        ? {
            redirect: {
              statusCode: 307,
              destination: redirect,
              basePath: false,
            },
          }
        : pagePropsHandler(
            Object.assign(context, {
              sessionProps: {
                session: userSession,
                endpointPaths: options.endpointPaths,
              },
            })
          );
    }
  };
}

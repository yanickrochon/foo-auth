import Cookies from "cookies";
import { getRequestURL } from "./utils/url";

import type {
  NextApiRequest,
  NextApiResponse,
  GetServerSidePropsContext,
} from "next";
import type {
  FooAuthApiRequest,
  FooAuthApiResponse,
  //FooAuthApiResponseValue,
} from "@foo-auth/core";
import type { IncomingMessage, ServerResponse } from "http";

type ServerAdapter<SessionType> = {
  req: FooAuthApiRequest;
  res: FooAuthApiResponse<SessionType>;
};

const createCookies = (req: IncomingMessage, res: ServerResponse) => {
  const cookies = new Cookies(req, res);
  return {
    has(key: string) {
      return !!cookies.get(key);
    },
    get(key: string) {
      return cookies.get(key);
    },
    set(key: string, value: string | undefined) {
      cookies.set(key, value);
    },
  };
};

export const serverApiAdapter = <SessionType>(
  req: NextApiRequest,
  res: NextApiResponse
): ServerAdapter<SessionType> => ({
  req: Object.assign<NextApiRequest, Partial<FooAuthApiRequest>>(req, {
    getURL: () => getRequestURL(req, req.url),
    cookies: createCookies(req, res),
  }) as FooAuthApiRequest,
  res,
});

export const serverPageAdapter = <SessionType>(
  context: GetServerSidePropsContext
): ServerAdapter<SessionType> => ({
  req: Object.assign<IncomingMessage, Partial<FooAuthApiRequest>>(context.req, {
    query: context.query,
    getURL: () => getRequestURL(context.req, context.resolvedUrl),
    cookies: createCookies(context.req, context.res),
  }) as FooAuthApiRequest,

  res: Object.assign<ServerResponse, Partial<FooAuthApiResponse<SessionType>>>(
    context.res,
    {
      send(/*body: FooAuthApiResponseValue<SessionType>*/) {
        throw new Error("Not implemented yet");
      },
      status(/*statusCode: number*/) {
        throw new Error("Not implemented yet");
      },
      redirect(/*statusCode: number | string, url?: string*/) {
        throw new Error("Not implemented yet");
      },
    }
  ) as FooAuthApiResponse<SessionType>,
});

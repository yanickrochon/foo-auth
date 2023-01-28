import type { NextApiRequest, NextApiResponse } from "next";
import type { FooAuthApiRequest, FooAuthApiResponse } from '@foo-auth/core';
import type { IncomingMessage, ServerResponse } from "http";


type ServerAdapter<SessionType> = {
  req:FooAuthApiRequest;
  res:FooAuthApiResponse<SessionType>;
}


export const serverApiAdapter = <SessionType> (req:NextApiRequest, res:NextApiResponse):ServerAdapter<SessionType> => ({ req, res });


export const serverPageAdapter = <SessionType> (req:IncomingMessage, res:ServerResponse<IncomingMessage>):ServerAdapter<SessionType> => ({
  req: {
    ...req as any,
    query: {},
    body: null
  },
  res: {
    ...res as any,
    send(body: any) {
      throw new Error('Not implemented yet');
    },
    status(statusCode: number) {
      throw new Error('Not implemented yet');
      //return this;
    },
    redirect(statusCode: number | string, url?: string) {
      throw new Error('Not implemented yet');
      //return this;
    }
  }
});
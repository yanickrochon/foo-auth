import type { NextApiRequest, NextApiResponse } from "next";
import type { FooAuthApiRequest, FooAuthApiResponse } from '@foo-auth/core';
import type { IncomingMessage, ServerResponse } from "http";


type ServerAdapter = {
  req:FooAuthApiRequest;
  res:FooAuthApiResponse;
}


export const serverApiAdapter = (req:NextApiRequest, res:NextApiResponse):ServerAdapter => ({ req, res });


export const serverPageAdapter = (req:IncomingMessage, res:ServerResponse<IncomingMessage>):ServerAdapter => ({
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
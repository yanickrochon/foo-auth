import type { NextApiRequest, NextApiResponse } from "next";
import type { FooAuthApiRequest, FooAuthApiResponse } from '@foo-auth/core';

export const serverAdapter = (req:NextApiRequest, res:NextApiResponse) => ({
  req: req as FooAuthApiRequest,
  res: res as FooAuthApiResponse,
});


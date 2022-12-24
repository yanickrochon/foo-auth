import type { NextApiRequest, NextApiResponse } from "next";
import { FooAuthConfig } from '@foo-auth/core';
export default function fooAuthNext<SessionType = any>(config: FooAuthConfig<SessionType>): (_req: NextApiRequest, _res: NextApiResponse) => Promise<void>;
//# sourceMappingURL=index.d.ts.map
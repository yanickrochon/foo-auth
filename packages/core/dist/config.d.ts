/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
import type { FooAuthApiRequest, FooAuthApiResponse } from './internals';
import type { FooAuthApiRoutes } from './internals';
export type FooAuthServerAdapter = {
    getRequest(req: IncomingMessage): FooAuthApiRequest;
    getResponse(res: ServerResponse): FooAuthApiResponse;
};
export type FooAuthConfig = {
    providers: FooAuthApiRoutes[];
    secret: string;
};
export declare function createFooAuth(server: FooAuthServerAdapter, config: FooAuthConfig): void;
//# sourceMappingURL=config.d.ts.map
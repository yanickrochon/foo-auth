import type { FooAuthConfigRoutePrefix, FooAuthApiRoutes } from "../internals";
type CredentialsBase = {
    [key: string]: string;
};
export type CredentialsOptions<Credentials extends CredentialsBase, SessionType = any> = {
    name?: string;
    authenticate(credentials: Credentials): PromiseLike<SessionType>;
};
export type FooAuthApiInitRoutes<SessionType> = {
    (routePrefix: FooAuthConfigRoutePrefix): FooAuthApiRoutes<SessionType>;
};
export declare function credentials<Credentials extends CredentialsBase, SessionType>(options: CredentialsOptions<Credentials, SessionType>): FooAuthApiInitRoutes<SessionType>;
export {};
//# sourceMappingURL=credentials.d.ts.map
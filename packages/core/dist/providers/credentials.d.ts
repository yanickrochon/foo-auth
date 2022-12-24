import type { FooAuthConfigRoutePrefix, FooAuthApiRoutes } from "../internals";
import type { ProviderRouteResponse } from './';
type CredentialsBase = {
    [key: string]: string;
};
export type CredentialsOptions<Credentials extends CredentialsBase, SessionType = any> = {
    name?: string;
    authenticate(credentials: Credentials): Promise<ProviderRouteResponse<SessionType>>;
};
export type FooAuthApiInitRoutes<SessionType> = {
    (routePrefix: FooAuthConfigRoutePrefix): FooAuthApiRoutes<SessionType>;
};
export type CredentialsProvider<SessionType, Credentials extends CredentialsBase> = {
    (options: CredentialsOptions<Credentials, SessionType>): FooAuthApiInitRoutes<SessionType>;
};
export declare function credentials<Credentials extends CredentialsBase, SessionType>(options: CredentialsOptions<Credentials, SessionType>): FooAuthApiInitRoutes<SessionType>;
export {};
//# sourceMappingURL=credentials.d.ts.map
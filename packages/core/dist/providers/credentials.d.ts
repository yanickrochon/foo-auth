import type { FooAuthConfigRoutePrefix, FooAuthApiRoutes } from "../internals";
import type { ProviderRouteResponse } from './';
type CredentialsBase = {
    [key: string]: string;
};
export type CredentialsOptions<Credentials extends CredentialsBase, T = any> = {
    name?: string;
    authenticate(credentials: Credentials): Promise<ProviderRouteResponse<T>>;
};
export type FooAuthApiInitRoutes<SessionType> = {
    (routePrefix: FooAuthConfigRoutePrefix): FooAuthApiRoutes<SessionType>;
};
export type CredentialsProvider<SessionType, Credentials extends CredentialsBase> = {
    (options: CredentialsOptions<Credentials>): FooAuthApiInitRoutes<SessionType>;
};
export declare function credentials<SessionType, Credentials extends CredentialsBase>(options: CredentialsOptions<Credentials>): FooAuthApiInitRoutes<SessionType>;
export {};
//# sourceMappingURL=credentials.d.ts.map
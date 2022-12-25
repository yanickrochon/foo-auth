import type Cookies from "cookies";
export type FooAuthApiRequest = {
    query: Partial<{
        [key: string]: string | string[];
    }>;
    body: any;
};
export type FooAuthApiResponse<T = any> = {
    redirect(statusCode: number, url: string): FooAuthApiResponse;
    redirect(url: string): FooAuthApiResponse;
    status(statusCode: number): FooAuthApiResponse;
    send(body: T): FooAuthApiResponse;
    end(cb?: () => void): FooAuthApiResponse;
};
export type FooAuthServerAdapter<Request, Response> = {
    getCookies(req: Request, res: Response): Cookies;
    getRequest(req: Request): FooAuthApiRequest;
    getResponse(res: Response): FooAuthApiResponse;
};
export type ClearSession = {
    (): void;
};
export type GetSession<SessionType> = {
    (): SessionType | null;
};
export type SetSession<SessionType> = {
    /**
     * Return a session token for the given session data
     */
    (sesion: SessionType): string;
};
export type FooSession<SessionType> = {
    clearSession: ClearSession;
    getSession: GetSession<SessionType>;
    setSession: SetSession<SessionType>;
};
export type FooAuthApiRouteOptions<SessionType> = {
    req: FooAuthApiRequest;
    res: FooAuthApiResponse;
    config: Omit<FooAuthConfig<SessionType>, "providers">;
    cookies: Cookies;
    session: FooSession<SessionType>;
};
export type FooAuthApiRouteHandler<SessionType> = {
    (options: FooAuthApiRouteOptions<SessionType>): void | Promise<void>;
};
export type FooAuthApiRoutes<SessionType> = {
    [x: string]: FooAuthApiRouteHandler<SessionType>;
};
export type FooAuthProvider<SessionType> = {
    (routePrefix: FooAuthConfigRoutePrefix): FooAuthApiRoutes<SessionType>;
};
export type FooSessionInitArg = {
    req: FooAuthApiRequest;
    res: FooAuthApiResponse;
    secret: string;
    cookies: Cookies;
};
export type FooSessionInit<SessionType> = {
    (args: FooSessionInitArg): FooSession<SessionType>;
};
export type FooAuthConfigRoutePrefix = {
    signIn?: string | undefined;
    signOut?: string | undefined;
    callback?: string | undefined;
    session?: string | undefined;
    csrfToken?: string | undefined;
};
export type FooAuthConfig<SessionType> = {
    session: FooSessionInit<SessionType>;
    providers: FooAuthProvider<SessionType>[];
    secret: string;
    baseRoutes?: FooAuthConfigRoutePrefix;
};
//# sourceMappingURL=internals.d.ts.map
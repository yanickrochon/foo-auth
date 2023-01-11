import type { FooSessionInitArg, FooSession, FooSessionConfig } from '../internals';
export type FooSessionCookiesConfig<SessionType> = {
    sessionName?: string;
} & FooSessionConfig<SessionType>;
export declare const DEFAULT_SESSION_COOKIE_NAME = "foo-auth:session";
export declare function sessionCookie<SessionType = any>({ sessionName, encodeSession, decodeSession }: FooSessionCookiesConfig<SessionType>): ({ cookies, secretKey }: FooSessionInitArg) => FooSession<SessionType>;
//# sourceMappingURL=cookie.d.ts.map
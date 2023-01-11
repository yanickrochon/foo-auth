import type { FooSessionInitArg, FooSessionConfig, FooSession } from '../internals';
export type FooSessionJwtConfig<SessionType> = {
    issuer: string;
    audience: string;
    maxTokenAge: string;
} & FooSessionConfig<SessionType>;
export declare const JWT_HEADER_NAME = "Authorization";
export declare function sessionCookie<SessionType = any>({ issuer, audience, maxTokenAge, encodeSession, decodeSession }: FooSessionJwtConfig<SessionType>): ({ req, secretKey }: FooSessionInitArg) => FooSession<SessionType>;
//# sourceMappingURL=jwt.d.ts.map
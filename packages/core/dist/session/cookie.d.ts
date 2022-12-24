import type { FooSessionInitArg, FooSession } from '../internals';
export declare const SESSION_COOKIE_NAME = "foo-auth:session";
export declare function sessionCookie<T = any>(): ({ cookies }: FooSessionInitArg) => FooSession<T>;
//# sourceMappingURL=cookie.d.ts.map
import type { FooSessionInitArg, FooSession } from '../internals';
export declare const JWT_HEADER_NAME = "x-authorized";
export declare function sessionCookie<T = any>(): ({ req, secret }: FooSessionInitArg) => FooSession<T>;
//# sourceMappingURL=jwt.d.ts.map
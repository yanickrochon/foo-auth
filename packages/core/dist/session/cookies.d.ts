import type { FooSession } from '../internals';
import Cookies from 'cookies';
export declare const SESSION_COOKIE_NAME = "foo-auth:session";
export declare function sessionCookie<T = any>(cookies: Cookies): FooSession<T>;
//# sourceMappingURL=cookies.d.ts.map
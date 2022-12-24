import Cookies from 'cookies';
export interface FooSession<T> {
    getSession(): T | null;
    setSession(session: T): void;
}
export declare const SESSION_COOKIE_NAME = "foo-auth:session";
export declare function fooSession<T = any>(cookies: Cookies): FooSession<T>;
//# sourceMappingURL=session.d.ts.map
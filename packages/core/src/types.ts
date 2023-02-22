import type { IncomingMessage, ServerResponse } from "http";
import type { KeyObject } from "crypto";

export type RequestURL = URL & {
  basePath: string;
};

export type FooAuthApiRequest = IncomingMessage & {
  getURL(): RequestURL | null;

  cookies: {
    has(key: string): boolean;
    get(key: string): string | null | undefined;
    set(key: string, value: string | undefined): void;
  };

  /**
   * Object of `query` values from url
   */
  query: Partial<{
    [key: string]: string | string[];
  }>;

  body?: any;
};

export type FooAuthApiCsrfResponse = {
  csrfToken: string;
};

export type FooAuthApiSessionResponse<SessionType> = {
  success: boolean;
  session: SessionType | null;
  token?: string | null;
  redirect?: string;
};

export type FooAuthApiSignOutResponse = {
  success: boolean;
};

export type FooAuthApiResponseValue<SessionType> =
  | FooAuthApiCsrfResponse
  | FooAuthApiSessionResponse<SessionType>
  | FooAuthApiSignOutResponse;

/**
 * Next `API` route response
 */
export type FooAuthApiResponse<SessionType> = ServerResponse & {
  /**
   * Send data `any` data in response
   */
  send(body: FooAuthApiResponseValue<SessionType>): void;
  status(statusCode: number): FooAuthApiResponse<SessionType>;
  redirect(url: string): FooAuthApiResponse<SessionType>;
  redirect(statusCode: number, url: string): FooAuthApiResponse<SessionType>;
};

export type SecretKey = KeyObject;

export type FooAuthSessionConfig<SessionType, SessionSnapshot = any> = {
  saveSession?(
    session: SessionType
  ): SessionSnapshot | Promise<SessionSnapshot>;
  restoreSession?(
    snapshot: SessionSnapshot
  ): SessionType | null | Promise<SessionType | null>;
};

export type FooAuthSession<SessionType> = {
  secretKey: SecretKey;

  clearSession(): void | PromiseLike<void>;
  hasSession(): boolean;
  getSession(): SessionType | null | PromiseLike<SessionType | null>;
  /**
   * Return a session token for the given session data, or undefined if the session token should not be exposed
   */
  getSessionToken():
    | string
    | null
    | undefined
    | PromiseLike<string | null | undefined>;
  /**
   * Return a session token for the given session data, or undefined if the session token should not be exposed
   */
  setSession(
    sessionValue: SessionType
  ): string | undefined | PromiseLike<string | undefined>;
};

export type FooAuthEndpointOptions<SessionType> = {
  req: FooAuthApiRequest;
  res: FooAuthApiResponse<SessionType>;
  session: FooAuthSession<SessionType>;
};

export type FooAuthEndpointHandler<SessionType> = {
  (options: FooAuthEndpointOptions<SessionType>): void | Promise<void>;
};

export type FooAuthEndpointHandlers<SessionType> = {
  [x: string]: FooAuthEndpointHandler<SessionType>;
};

export type FooAuthProviderInitOptions<Credentials, SessionType> = {
  name?: string;
  authenticate(
    credentials: Credentials
  ): SessionType | null | PromiseLike<SessionType | null>;
};

export type FooAuthProvider<SessionType> = {
  (endpointPath: FooAuthEndpoints): FooAuthEndpointHandlers<SessionType>;
};

export type FooAuthSessionInitOptions<SessionType> = {
  req: FooAuthApiRequest;
  res: FooAuthApiResponse<SessionType>;
  secretKey: SecretKey;
};

export type FooSessionInit<SessionType> = {
  (
    options: FooAuthSessionInitOptions<SessionType>
  ): FooAuthSession<SessionType>;
};

export type FooAuthEndpoints = {
  signIn?: string;
  signOut?: string;
  callback?: string;
  session?: string;
  csrfToken?: string;
};

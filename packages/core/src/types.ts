import type { IncomingMessage, ServerResponse } from 'http';
import type Cookies from "cookies";
import type { KeyObject } from 'crypto';

export interface FooAuthApiRequest extends IncomingMessage {
  /**
   * Object of `query` values from url
   */
  query: Partial<{
      [key: string]: string | string[];
  }>;
  body: any;
};


export type FooAuthApiResponseValue<SessionType> = {
  status: true | false;
  redirect?: string;
  session?: SessionType | null;
  token?: string | null;
};


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


type ClearSession = {
  ():void | PromiseLike<void>;
};

type GetSession<SessionType> = {
  ():SessionType | null | PromiseLike<SessionType | null>;
};

type SetSession<SessionType> = {
  /**
   * Return a session token for the given session data
   */
  (sessionValue:SessionType):string | PromiseLike<string>;
};

type SessionToken = {
  ():string | null | undefined | PromiseLike<string | null | undefined>;
};


export type FooAuthSessionConfig<SessionType, SessionSnapshot = any> = {
  saveSession?(session:SessionType):SessionSnapshot;
  restoreSession?(snapshot:SessionSnapshot):SessionType;
};


export type FooAuthSession<SessionType> = {
  clearSession:ClearSession;
  getSession:GetSession<SessionType>;
  getSessionToken:SessionToken;
  setSession:SetSession<SessionType>;
};


export type FooAuthEndpointOptions<SessionType> = {
  req:FooAuthApiRequest;
  res:FooAuthApiResponse<SessionType>;
  cookies:Cookies;
  session:FooAuthSession<SessionType>;
  secretKey:SecretKey;
};

export type FooAuthEndpointHandler<SessionType> = {
  (options:FooAuthEndpointOptions<SessionType>):void | Promise<void>;
};

export type FooAuthEndpointHandlers<SessionType> = {
  [x:string]: FooAuthEndpointHandler<SessionType>
};


export type FooAuthProviderInitOptions<Credentials, SessionType> = {
  name?:string;
  authenticate(credentials:Credentials):SessionType | null | PromiseLike<SessionType | null>;
};

export type FooAuthProvider<SessionType> = {
  (endpointPath:FooAuthEndpoints):FooAuthEndpointHandlers<SessionType>;
};


export type FooAuthSessionInitArg<SessionType> = {
  req:FooAuthApiRequest;
  res:FooAuthApiResponse<SessionType>;
  cookies:Cookies;
  secretKey:SecretKey;
};

export type FooSessionInit<SessionType> = {
  (args:FooAuthSessionInitArg<SessionType>): FooAuthSession<SessionType>;
};

export type FooAuthEndpoints = {
  signIn:string;
  signOut:string;
  callback:string;
  session:string;
  csrfToken:string;
};
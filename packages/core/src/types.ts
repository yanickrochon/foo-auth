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


/**
* Next `API` route response
*/
export declare type FooAuthApiResponse<T = any> = ServerResponse & {
  /**
  * Send data `any` data in response
  */
  send(body: T): void;
  status(statusCode: number): FooAuthApiResponse<T>;
  redirect(url: string): FooAuthApiResponse<T>;
  redirect(statusCode: number, url: string): FooAuthApiResponse<T>;
};

export type SecretKey = KeyObject;


type ClearSession = {
  ():void | PromiseLike<void>;
}

type GetSession<SessionType> = {
  ():SessionType | null | PromiseLike<SessionType | null>;
}

type SetSession<SessionType> = {
  /**
   * Return a session token for the given session data
   */
  (sessionValue:SessionType):string | PromiseLike<string>;
}

type SessionToken = {
  ():string | null | undefined | PromiseLike<string | null | undefined>;
}


export type FooAuthSessionConfig<SessionType> = {
  encodeSession?(sessionValue:SessionType):Partial<SessionType> | PromiseLike<Partial<SessionType>>;
  decodeSession?(data:Partial<SessionType>):SessionType | PromiseLike<SessionType>;
}


export type FooAuthSession<SessionType> = {
  clearSession:ClearSession;
  getSession:GetSession<SessionType>;
  getSessionToken:SessionToken;
  setSession:SetSession<SessionType>;
}


export type FooAuthEndpointOptions<SessionType> = {
  req:FooAuthApiRequest;
  res:FooAuthApiResponse;
  cookies:Cookies;
  session:FooAuthSession<SessionType>;
  secretKey:SecretKey;
}

export type FooAuthEndpointHandler<SessionType> = {
  (options:FooAuthEndpointOptions<SessionType>):void | Promise<void>;
}

export type FooAuthEndpointHandlers<SessionType> = {
  [x:string]: FooAuthEndpointHandler<SessionType>
};


export type FooAuthProvider<SessionType> = {
  (endpointPath:FooAuthEndpoints):FooAuthEndpointHandlers<SessionType>;
}


export type FooAuthSessionInitArg = {
  req:FooAuthApiRequest;
  res:FooAuthApiResponse;
  cookies:Cookies;
  secretKey:SecretKey;
}

export type FooSessionInit<SessionType> = {
  (args:FooAuthSessionInitArg): FooAuthSession<SessionType>;
}

export type FooAuthEndpoints = {
  signIn:string;
  signOut:string;
  callback:string;
  session:string;
  csrfToken:string;
};
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

export type FooAuthServerAdapter<Request, Response> = {
  getCookies(req:Request, res:Response):Cookies;
  getRequest(req:Request):FooAuthApiRequest;
  getResponse(res:Response):FooAuthApiResponse;
}


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


export type FooSessionConfig<SessionType> = {
  encodeSession(sessionValue:SessionType):Partial<SessionType> | PromiseLike<Partial<SessionType>>;
  decodeSession(data:Partial<SessionType>):SessionType | PromiseLike<SessionType>;
}


export type FooSession<SessionType> = {
  clearSession:ClearSession;
  getSession:GetSession<SessionType>;
  getSessionToken:SessionToken;
  setSession:SetSession<SessionType>;
}


export type FooAuthApiRouteOptions<SessionType> = {
  req:FooAuthApiRequest;
  res:FooAuthApiResponse;
  config:Omit<FooAuthConfig<SessionType>, "providers">;
  cookies:Cookies;
  session:FooSession<SessionType>;
  secretKey:KeyObject;
}

export type FooAuthApiRouteHandler<SessionType> = {
  (options:FooAuthApiRouteOptions<SessionType>):void | Promise<void>;
}

export type FooAuthApiRoutes<SessionType> = {
  [x:string]: FooAuthApiRouteHandler<SessionType>
};


export type FooAuthProvider<SessionType> = {
  (routePrefix:FooAuthConfigRoutePrefix):FooAuthApiRoutes<SessionType>;
}


export type FooSessionInitArg = {
  req:FooAuthApiRequest;
  res:FooAuthApiResponse;
  cookies:Cookies;
  secretKey:KeyObject;
}

export type FooSessionInit<SessionType> = {
  (args:FooSessionInitArg): FooSession<SessionType>;
}

export type FooAuthConfigRoutePrefix = {
  signIn?:string|undefined;
  signOut?:string|undefined;
  callback?:string|undefined;
  session?:string|undefined;
  csrfToken?:string|undefined;
};


export type FooAuthConfig<SessionType> = {
  session:FooSessionInit<SessionType>;
  providers:FooAuthProvider<SessionType>[];
  baseRoutes?:FooAuthConfigRoutePrefix;
  secret:string;
};

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
export type FooAuthApiResponse<Response = any> = ServerResponse & {
  /**
  * Send data `any` data in response
  */
  send(body: Response): void;
  status(statusCode: number): FooAuthApiResponse<Response>;
  redirect(url: string): FooAuthApiResponse<Response>;
  redirect(statusCode: number, url: string): FooAuthApiResponse<Response>;
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


export type FooAuthSessionConfig<SessionType> = {
  encodeSession?(sessionValue:SessionType):Partial<SessionType> | PromiseLike<Partial<SessionType>>;
  decodeSession?(data:Partial<SessionType>):SessionType | PromiseLike<SessionType>;
};


export type FooAuthSession<SessionType> = {
  clearSession:ClearSession;
  getSession:GetSession<SessionType>;
  getSessionToken:SessionToken;
  setSession:SetSession<SessionType>;
};


export type FooAuthEndpointOptions<SessionType, Response> = {
  req:FooAuthApiRequest;
  res:FooAuthApiResponse<Response>;
  cookies:Cookies;
  session:FooAuthSession<SessionType>;
  secretKey:SecretKey;
};

export type FooAuthEndpointHandler<SessionType> = {
  <Response = any> (options:FooAuthEndpointOptions<SessionType, Response>):void | Promise<void>;
};

export type FooAuthEndpointHandlers<SessionType> = {
  [x:string]: FooAuthEndpointHandler<SessionType>
};


export type FooAuthProvider<SessionType> = {
  (endpointPath:FooAuthEndpoints):FooAuthEndpointHandlers<SessionType>;
};


export type FooAuthSessionInitArg = {
  req:FooAuthApiRequest;
  res:FooAuthApiResponse;
  cookies:Cookies;
  secretKey:SecretKey;
};

export type FooSessionInit<SessionType> = {
  (args:FooAuthSessionInitArg): FooAuthSession<SessionType>;
};

export type FooAuthEndpoints = {
  signIn:string;
  signOut:string;
  callback:string;
  session:string;
  csrfToken:string;
};



// export type FooAuthApiRequestValidation = {
//   csrfToken:string;
// }

// export type FooAuthApiCsrfTokenResponse = {
//   csrfToken:string;
// };

// export type FooAuthApiCsrfTokenQuery = {
//   ():Promise<FooAuthApiCsrfTokenResponse>;
// };

// export type FooAuthApiSignOutResponse = {
//   success:boolean;
// };

// export type FooAuthApiSignOutQuery = {
//   (payload:FooAuthApiRequestValidation):Promise<FooAuthApiSignOutResponse>;
// };


// export type FooAuthApiSessionResponse<SessionType> = {
//   success:boolean;
//   token:string | null | undefined;
//   session:SessionType | null;
// };

// export type FooAuthApiSessionQuery = {
//   <SessionType> ():Promise<FooAuthApiSessionResponse<SessionType>>
// };

// export type FooAuthApiSignInMutation<Credential> = {
//   <SessionType> (providerName:string, payload:(Credential & FooAuthApiRequestValidation)):Promise<FooAuthApiSessionResponse<SessionType>>;
// };
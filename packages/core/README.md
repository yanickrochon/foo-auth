# Foo Auth Core

Core package for Foo Auth



# Basic usage

```ts
import {
  createSecretKey,
  getEndpoints,
  Cookies,
  sessionCookie,
  sessionJwt,

  type FooAuthApiRequest,
  type FooAuthApiResponse,
  type FooAuthProvider,
} from '@foo-auth/core';

import type { IncomingMessage, ServerResponse } from 'http';


// typical user session data
type SessionType = {
  username:string;
}

interface UserCredentials {
  username:string;
}



// 1. Create secret key
const secretKey = createSecretKey('secret (must be at least 32 bytes long)');


// 2. Create session 
const session = sessionCookie(/* config */);
// ... or
const session = sessionJwt(/* config */);


// 3. Create providers
const providers:FooAuthProvider<SessionType>[] = [
  credentials({
    name: 'credentials',  // optional
    authenticate(credentials:UserCredentials) {
      return ...; // return user or null
    }
  }),

  // ...
];


// 4. Get endpoints
const endpoints = getEndpoints({
  // endpointPath,
  providers
});


// 5. Create a request and response adapter
const serverAdatper = (req:IncomingMessage, res:ServerResponse) => ({
  req: ... req as FooAuthApiRequest,  // TODO : properly implement required type
  res: ... res as FooAuthApiResponse, //
});


// 6. Create middleware
const middleware = async (_req:IncomingMessage, _res:ServerResponse) => {
  const { req, res } = serverAdapter(_req, _res);
  const endpoint = endpoints[_req.url];  // ex: endpoints['/session']

  // if we have an endpoint
  if (endpoint) {
    const cookies = new Cookies(_req, _res);

    await endpoint({
      req,
      res,
      cookies,
      session: session({ req, res, cookies, secretKey }),
      secretKey
    });
  } 

  // if no headers were sent, error 404
  if (!res.headersSent) {
    res.status(404).end();
  }
};
```
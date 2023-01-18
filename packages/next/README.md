# Foo Auth Next.js Adapter

## Install

```
$ npm i @foo-auth/core @foo-auth/next
-- or
$ yarn add @foo-auth/core @foo-auth/next
-- or
$ pnpm i @foo-auth/core @foo-auth/next
```

## Usage

```ts
// ./src/pages/api/[[...auth]].ts

import { credentials, sessionCookie, createSecretKey } from '@foo-auth/core';
import {
  fooAuthNext,
  type NextFooAuthConfig
} from '@foo-auth/next'; 

import type { UserType, UserCredentials } from '../../types';


export const config:NextFooAuthConfig<UserType> = {
  endpointPath: {
    callback: '/callback',
    csrfToken: '/csrf-token',
    session: '/session',
    signIn: '/sign-in',
    signOut: '/sign-out',
  },

  session: sessionCookie({
    encodeSession({ id }) {
      return { id };  // save only user id to the session cookie
    },
    async decodeSession({ id }) {
      const user = await db.users.findOne({ id });
      
      if (!user) {
        throw new Error('Missing user');
      }

      return user; 
    }
  }),

  providers: [
    credentials({
      authenticate({ username, password }:UserCredentials) {
        const user = await db.users.find({ where: { username, password } });

        return user;  // UserType | null
      }
    })
  ],
  
  secretKey: createSecretKey('0c6136daeb78f8cd5cdc1eb963c3f83c5209494c2130b9cf9ab5e019146f0c1e')
};

export default fooAuthNext(config);
```
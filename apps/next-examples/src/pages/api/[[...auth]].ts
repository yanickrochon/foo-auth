import { credentials, sessionCookie } from '@foo-auth/core';
import fooAuthNext from '@foo-auth/next'; 


type SessionType = {
  user:string;
}

type UserCredentials = {
  username:string;
  password:string;
};



export default fooAuthNext<SessionType>({

  session: sessionCookie({
    encodeSession(sessionValue) {
      return sessionValue;
    },
    decodeSession(data) {
      return {
        user: data.user ?? ''
      };
    }
  }),

  providers: [
    credentials({
      async authenticate(credentials:UserCredentials) {
        return {
          user: credentials.username
        };
      }
    })
  ],
  
  secret: '0c6136daeb78f8cd5cdc1eb963c3f83c5209494c2130b9cf9ab5e019146f0c1e'
});
import { credentials, sessionCookie } from '@foo-auth/core';
import fooAuthNext from '@foo-auth/next'; 


type SessionType = {
  user:string;
}

type UserCredentials = {
  username:string;
  password:string;
};


export default fooAuthNext({

  session: sessionCookie(),

  providers: [
    credentials<SessionType, UserCredentials>({
      async authenticate(credentials:UserCredentials) {
        return {
          success:true,
          message: credentials
        };
      }
    })
  ],
  
  secret: '53cr3t'
});
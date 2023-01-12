import { credentials, sessionCookie } from '@foo-auth/core';
import fooAuthNext from '@foo-auth/next'; 

import data from '../../data.json';

type DataArray<T> = T extends readonly (infer ElementType)[]
  ? ElementType
  : never;

type UserData = DataArray<typeof data.users>;

type SessionType = Omit<UserData, "password">;

type UserCredentials = {
  username:string;
  password:string;
};



const findUser = (predicate:(user:UserData)=>boolean) => {
  for (const user of data.users) {
    if (predicate(user)) {
      return user;
    }
  }

  return null;
}

const convertSessionType = (user:UserData|null):SessionType => {
  const sessionValue = { ...user } as any;
  delete sessionValue.password;
  return sessionValue;
}





export default fooAuthNext<SessionType>({

  session: sessionCookie({
    encodeSession(sessionValue) {
      return { id:sessionValue.id };  // save only id
    },
    decodeSession(data) {
      const user = findUser(user => user.id === data.id);
      
      return convertSessionType(user);
    }
  }),

  providers: [
    credentials({
      authenticate(credentials:UserCredentials) {
        const user = findUser(user => user.username === credentials.username && user.password === credentials.password);

        if (user) {
          return convertSessionType(user);
        } else {
          return null;
        }
      }
    })
  ],
  
  secret: '0c6136daeb78f8cd5cdc1eb963c3f83c5209494c2130b9cf9ab5e019146f0c1e'
});
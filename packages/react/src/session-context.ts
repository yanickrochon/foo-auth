import * as React from 'react';


export type SessionProviderContextValue<T = any> = {
  session:T;
  setSession(session:T):void;
};

export const SessionProviderContext = React.createContext<SessionProviderContextValue>({
  session:null,
  setSession() {
    throw new Error('Missing SessionProvider');
  }
});

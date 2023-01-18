import * as React from 'react';

import {
  SessionProviderContext,
  type SessionProviderContextValue
} from './session-context';


export type SessionProviderProps = {
  session?:any | undefined;
  children: React.ReactNode;
};

export const SessionProvider:React.FC<SessionProviderProps> = ({
  session:initialSession  = null,
  children
}:SessionProviderProps) => {
  const [ session, setSession ] = React.useState(initialSession);

  const contextValue:SessionProviderContextValue = {
    session,
    setSession
  };

  return (
    <SessionProviderContext.Provider value={ contextValue }>
      { children }
    </SessionProviderContext.Provider>
  );
};
import * as React from 'react';

import { SessionProviderContext } from './session-context';


import {
  getCsrfTokenQuery,
  getSessionQuery,
  getSignInMutation,
  getSignOutMutation
} from './queries';

import type { FooAuthEndpoints } from '@foo-auth/core';

import type { SessionProviderContextValue } from './types';


export type SessionProviderProps<SessionType> = {
  endpointPaths:FooAuthEndpoints;
  session?:SessionType | null;
  sessionRef?: React.ForwardedRef<SessionProviderContextValue<SessionType>>;
  children: React.ReactNode;
};

export const SessionProvider = <SessionType extends unknown> ({
  endpointPaths,
  session:initialSession  = null,
  sessionRef,
  children
}:SessionProviderProps<SessionType>) => {
  const [ session, setSession ] = React.useState(initialSession);

  const contextValue:SessionProviderContextValue = {
    session,
    setSession,
    queries: {
      csrfTokenQuery: getCsrfTokenQuery(endpointPaths),
      sessionQuery: getSessionQuery(endpointPaths),
      signInMutation: getSignInMutation(endpointPaths),
      signOutMutation: getSignOutMutation(endpointPaths),
    }
  };

  React.useImperativeHandle(sessionRef, () => contextValue, [contextValue]);

  return (
    <SessionProviderContext.Provider value={ contextValue }>
      { children }
    </SessionProviderContext.Provider>
  );
};
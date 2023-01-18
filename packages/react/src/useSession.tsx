import * as React from 'react';

import {
  SessionProviderContext,
  type SessionProviderContextValue
} from './session-context';


/**
 * Return the current session
 */
export function useSession<SessionType>(): SessionType {
  const { session, setSession } = React.useContext<SessionProviderContextValue<SessionType>>(SessionProviderContext);

  // TODO : update session...

  return session;
};
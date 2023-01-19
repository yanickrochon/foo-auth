import * as React from 'react';

import { SessionProviderContext } from './session-context';

import type {
  SessionProviderContextValue,
  SessionProviderQueries
} from './types';

/**
 * Return the current session query
 */
export function useSession<SessionType>(): SessionType | null {
  const { session } = React.useContext<SessionProviderContextValue<SessionType>>(SessionProviderContext);

  return session;
};


/**
 * Return the session queries
 */
export function useSessionQueries<SessionType>():SessionProviderQueries<SessionType> {
  const { queries } = React.useContext<SessionProviderContextValue<SessionType>>(SessionProviderContext);

  return queries;
}
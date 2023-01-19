import * as React from 'react';

import type { SessionProviderContextValue } from './types';


export const SessionProviderContext = React.createContext<SessionProviderContextValue<any>>({
  session:null,
  setSession() {
    throw new Error('Missing SessionProvider');
  },
  queries: {
    csrfTokenQuery() {
      throw new Error('Missing SessionProvider');
    },
    sessionQuery() {
      throw new Error('Missing SessionProvider');
    },
    signInMutation() {
      throw new Error('Missing SessionProvider');
    },
    signOutMutation() {
      throw new Error('Missing SessionProvider');
    },
  }
});

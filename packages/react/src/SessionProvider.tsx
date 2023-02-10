import * as React from "react";

import { SessionProviderContext } from "./session-context";

import {
  getCsrfTokenQuery,
  getSessionQuery,
  getSignInMutation,
  getSignOutMutation,
} from "./queries";

import type { FooAuthEndpoints } from "@foo-auth/core";

import type {
  SessionProviderContextValue,
  SessionProviderQueries,
} from "./types";

export type SessionProviderProps<SessionType> = {
  endpointPaths: FooAuthEndpoints;
  session?: SessionType | null;
  sessionRef?: React.ForwardedRef<SessionProviderContextValue<SessionType>>;
  children: React.ReactNode;
};

const dummyQueries: SessionProviderQueries<any> = {
  async csrfTokenQuery() {
    return { csrfToken: "" };
  },
  async sessionQuery() {
    return { success: true, session: null };
  },
  async signInMutation() {
    return { success: true, session: null };
  },
  async signOutMutation() {
    return { success: true };
  },
};

export const SessionProvider = <SessionType extends unknown>({
  endpointPaths,
  session: initialSession = null,
  sessionRef,
  children,
}: SessionProviderProps<SessionType>) => {
  const [session, setSession] = React.useState<SessionType | null>(
    initialSession
  );

  const contextValue: SessionProviderContextValue<SessionType> = {
    session,
    clearSession() {
      setSession(null);
    },
    queries: endpointPaths
      ? {
          csrfTokenQuery: getCsrfTokenQuery(endpointPaths),
          sessionQuery: getSessionQuery(endpointPaths),
          signInMutation: getSignInMutation(endpointPaths),
          signOutMutation: getSignOutMutation(endpointPaths),
        }
      : dummyQueries,
  };

  React.useImperativeHandle(sessionRef, () => contextValue, [contextValue]);

  return (
    <SessionProviderContext.Provider value={contextValue}>
      {children}
    </SessionProviderContext.Provider>
  );
};

import * as React from "react";

import { QueryClient, QueryClientProvider } from "react-query";

import { SessionProvider } from "@foo-auth/react";

import type { FooAuthPageProps } from "@foo-auth/next";
import type { UserSession } from "../types/foo-auth";
import type { AppType } from "next/app";

import type { SessionProviderContextValue } from "@foo-auth/react";

import "../main.css";

const queryClient = new QueryClient();

const NextDemoApp: AppType<FooAuthPageProps<UserSession>> = ({
  Component,
  pageProps: { session, endpointPaths, ...pageProps },
}) => {
  const sessionRef =
    React.useRef<SessionProviderContextValue<UserSession>>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider
        sessionRef={sessionRef}
        session={session}
        endpointPaths={endpointPaths}
      >
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default NextDemoApp;

import * as React from 'react';

import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { SessionProvider } from '@foo-auth/react';

import type { FooAuthPageProps } from '@foo-auth/next';
import type { SessionType } from './api/[...auth]';
import type { AppType } from "next/app";

import type { SessionProviderContextValue } from '@foo-auth/react';



const queryClient = new QueryClient();

const NextDemoApp: AppType<FooAuthPageProps<SessionType>> = ({
  Component,
  pageProps: { session, endpointPaths, ...pageProps },
}) => {
  const sessionRef = React.useRef<SessionProviderContextValue<SessionType>>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider
        sessionRef={ sessionRef }
        session={ session }
        endpointPaths={ endpointPaths }
      >
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default NextDemoApp;

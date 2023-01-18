import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { SessionProvider } from '@foo-auth/react';

import type { FooAuthPageProps } from '@foo-auth/next';
import type { SessionType } from './api/[[...auth]]';
import type { AppType } from "next/app";





const queryClient = new QueryClient();

const NextDemoApp: AppType<FooAuthPageProps<SessionType>> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={ session }>
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default NextDemoApp;

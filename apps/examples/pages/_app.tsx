import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import type { AppType } from "next/app";



const queryClient = new QueryClient();

const NextDemoApp: AppType = ({
  Component,
  pageProps,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
};

export default NextDemoApp;

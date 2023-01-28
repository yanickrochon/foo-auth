
import { useMutation, useQuery, useQueryClient } from 'react-query';
//import { getCsrfTokenQuery, getSessionQuery, postSignInQuery, postSignOutQuery } from '../routes';

import { getPageProps } from '@foo-auth/next';
import { fooAuthConfig, type UserCredentials, type SessionType } from './api/[...auth]';

import type { GetServerSideProps } from 'next';
import type { SyntheticEvent } from 'react';

import {
  useSessionQueries,
  type GetSignInMutationOptions,
} from '@foo-auth/react';


export const getServerSideProps:GetServerSideProps = async ({ req, res }) => {
  return {
    props: {
      ...await getPageProps({ req, res, config:fooAuthConfig })
    }
  }
};


export default function IndexPage() {
  const queryClient = useQueryClient();
  const { 
    csrfTokenQuery,
    sessionQuery,
    signInMutation,
    signOutMutation
  } = useSessionQueries<SessionType>();

  const { data:csrfData } = useQuery(['csrf'], csrfTokenQuery, {
    refetchOnWindowFocus:false
  });
  const { data:sessionData } = useQuery(['session'], sessionQuery, {
    refetchOnWindowFocus:false
  });

  const handleSignIn = useMutation(async (options:GetSignInMutationOptions<UserCredentials>) => signInMutation(options), {
    onSuccess: () => {
      // Invalidate session
      queryClient.invalidateQueries('session');
    },
  });

  const handleSignOut = useMutation(signOutMutation, {
    onSuccess: () => {
      // Invalidate session
      queryClient.invalidateQueries('session');
    }
  });


  const handleSubmit = (e:SyntheticEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);

    if (csrfData) {
      handleSignIn.mutate({
        providerName: 'credentials',
        payload: Object.fromEntries(data.entries()) as any
      });
    }
  };


  return (
    <div>
      <h1>Next Example</h1>

      <form onSubmit={ handleSubmit }>
        <input type="text" name="username" />
        <input type="password" name="password" />
        <input type="hidden" name="csrfToken" value={ csrfData?.csrfToken ?? '' } />
        <button type="submit">Sign In</button>
      </form>

      <div>
        <button onClick={() => {
          if (csrfData) {
            handleSignOut.mutate({ payload: csrfData });
          }
        }}>
          Logout
        </button>
      </div>

      <div>
        <pre>
          <code>
            { JSON.stringify({ sessionData, csrfData }, null, 3) }
          </code>
        </pre>
      </div>
    </div>
  );
}


import { useMutation, useQuery, useQueryClient } from 'react-query';
//import { getCsrfTokenQuery, getSessionQuery, postSignInQuery, postSignOutQuery } from '../routes';

import { getPageProps } from '@foo-auth/next';
import { fooAuthConfig, type UserCredentials } from './api/[[...auth]]';

import type { GetServerSideProps } from 'next';
import type { SyntheticEvent } from 'react';


import { useSessionQueries } from '@foo-auth/react';


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
  } = useSessionQueries();

  const { data:csrfData } = useQuery(['csrf'], async () => {
    const foo = csrfTokenQuery();
  }, {
    refetchOnWindowFocus:false
  });
  const { data:sessionData } = useQuery(['session'], async () => {}, {
    refetchOnWindowFocus:false
  });

  const handleSignIn = useMutation(async () => {}, {
    onSuccess: () => {
      // Invalidate session
      queryClient.invalidateQueries('session');
    },
  });

  const handleSignOut = useMutation(async () => {}, {
    onSuccess: () => {
      // Invalidate session
      queryClient.invalidateQueries('session');
    }
  });


  const handleSubmit = (e:SyntheticEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);

    console.log( Object.fromEntries(data.entries()) );
  };


  return (
    <div>
      <h1>Next Example</h1>

      <form onSubmit={ handleSubmit }>
        <input type="text" name="username" />
        <input type="password" name="password" />
        <input type="hidden" name="csrfToken" />
        <button type="submit">Sign In</button>
      </form>



      <div>
        <button onClick={() => {
          // signInMutation.mutate({
          //   username: 'john@email.com',
          //   password: '123',
          //   csrfToken: csrfData.csrfToken
          // });
        }}>
          Login
        </button>
        <button onClick={() => {
          //signOutMutation.mutate();
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

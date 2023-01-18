
import type { GetServerSideProps } from 'next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getCsrfTokenQuery, getSessionQuery, postSignInQuery, postSignOutQuery } from '../routes';

import { getPageProps } from '@foo-auth/next';
import { fooAuthConfig } from './api/[[...auth]]';


export const getServerSideProps:GetServerSideProps = async ({ req, res }) => {
  return {
    props: {
      ...await getPageProps({ req, res, config:fooAuthConfig })
    }
  }
};


export default function IndexPage() {
  const queryClient = useQueryClient();

  const { data:csrfData } = useQuery(['csrf'], getCsrfTokenQuery, { refetchOnWindowFocus:false });
  const { data:sessionData } = useQuery(['session'], getSessionQuery, { refetchOnWindowFocus:false });

  const signInMutation = useMutation(postSignInQuery, {
    onSuccess: () => {
      // Invalidate session
      queryClient.invalidateQueries('session');
    },
  });

  const signOutMutation = useMutation(postSignOutQuery, {
    onSuccess: () => {
      // Invalidate session
      queryClient.invalidateQueries('session');
    }
  })

  return (
    <div>
      <h1>Next Example</h1>

      <div>
        <button onClick={() => {
          signInMutation.mutate({
            username: 'john@email.com',
            password: '123',
            csrfToken: csrfData.csrfToken
          });
        }}>
          Login
        </button>
        <button onClick={() => {
          signOutMutation.mutate();
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

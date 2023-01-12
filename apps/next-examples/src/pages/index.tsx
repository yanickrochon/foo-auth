
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getCsrfToken, getSession, postSignIn, postSignOut } from '../routes';


export default function Docs() {
  const queryClient = useQueryClient();

  const { data:csrfData } = useQuery(['csrf'], getCsrfToken, { refetchOnWindowFocus:false });
  const { data:sessionData } = useQuery(['session'], getSession, { refetchOnWindowFocus:false });

  const signInMutation = useMutation(postSignIn, {
    onSuccess: () => {
      // Invalidate session
      queryClient.invalidateQueries('session');
    },
  });

  const signOutMutation = useMutation(postSignOut, {
    onSuccess: () => {
      // Invalidate session
      queryClient.invalidateQueries('session');
    }
  })

  return (
    <div>
      <h1>Docs</h1>

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

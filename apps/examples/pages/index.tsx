
import { useMutation, useQuery, useQueryClient } from 'react-query';


type SignInInput = {
  username:string;
  password:string;
  csrfToken:string;
}



const getCsrfToken = async () => fetch('/api/csrf-token', {
  method:"GET",
  headers: {
    "Accept": "application/json",
  }
}).then(response => response.json());

const getSession = async () => fetch('/api/session', {
  method:"GET",
  headers: {
    "Accept": "application/json",
  }
}).then(response => response.json());


const postSignIn = async (payload:SignInInput) => fetch('/api/sign-in/credentials', {
  method:"POST",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
}).then(response => response.json());


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


  return (
    <div>
      <h1>Docs</h1>

      <div>
        <button onClick={() => {
          signInMutation.mutate({
            username: 'john@email.com',
            password: 'password',
            csrfToken: csrfData.csrfToken
          });
        }}>
          Login
        </button>
        <button onClick={() => {
          console.log("click");
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

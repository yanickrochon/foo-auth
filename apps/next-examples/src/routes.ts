
export type SignInInput = {
  username:string;
  password:string;
  csrfToken:string;
}


export const getCsrfToken = async () => fetch('/api/csrf-token', {
  method:"GET",
  headers: {
    "Accept": "application/json",
  }
}).then(response => response.json());

export const getSession = async () => fetch('/api/session', {
  method:"GET",
  headers: {
    "Accept": "application/json",
  }
}).then(response => response.json());


export const postSignIn = async (payload:SignInInput) => fetch('/api/sign-in/credentials', {
  method:"POST",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
}).then(response => response.json());

export const postSignOut = async () => fetch('/api/sign-out', {
  method: 'POST',
  headers: {
    "Accept": "application/json"
  }
});

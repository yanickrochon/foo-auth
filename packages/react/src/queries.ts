import type {
    FooAuthEndpoints,
//     FooAuthApiCsrfTokenQuery,
//     FooAuthApiSignOutQuery,
//     FooAuthApiSessionQuery,
//     FooAuthApiSignInMutation
} from '@foo-auth/core';

import type {
    GetCsrfTokenQuery,
    GetSessionQuery,
    GetSignInMutation,
    GetSignOutMutation
} from './types';




const basePath = process.env.NEXT_PUBLIC_FOO_AUTH_API_BASE_PATH ?? '';



export const getCsrfTokenQuery = ({ csrfToken }:FooAuthEndpoints):GetCsrfTokenQuery => async () => 
    fetch(`${basePath}${csrfToken}`, {
        method:"GET",
        headers: {
            "Accept": "application/json",
        }
    }).then(response => response.json());
  
export const getSessionQuery = <SessionType> ({ session }:FooAuthEndpoints):GetSessionQuery<SessionType> => async () => 
    fetch(`${basePath}${session}`, {
        method:"GET",
        headers: {
        "Accept": "application/json",
        }
    }).then(response => response.json());


export const getSignInMutation = <SessionType> ({ signIn }:FooAuthEndpoints):GetSignInMutation<SessionType> => async ({ providerName, payload }) => 
    fetch(`${basePath}${signIn}/${providerName}`, {
        method:"POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(response => response.json());

export const getSignOutMutation = ({ signOut }:FooAuthEndpoints):GetSignOutMutation => async ({ payload }) => 
    fetch(`${basePath}${signOut}`, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(response => response.json());
  
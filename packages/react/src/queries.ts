import type {
    FooAuthApiRequestValidation,
    FooAuthEndpoints,
    FooAuthApiCsrfTokenResponse,
    FooAuthApiSignOutResponse,
    FooAuthApiSessionResponse
} from '@foo-auth/core';



const basePath = process.env.FOO_AUTH_API_BASE_PATH ?? '';


export const getCsrfTokenQuery = ({ csrfToken }:FooAuthEndpoints) => async ():Promise<FooAuthApiCsrfTokenResponse> => 
    fetch(`${basePath}${csrfToken}`, {
        method:"GET",
        headers: {
            "Accept": "application/json",
        }
    }).then(response => response.json());
  
  export const getSessionQuery = ({ session }:FooAuthEndpoints) => async <SessionType> ():Promise<FooAuthApiSessionResponse<SessionType>> => 
    fetch(`${basePath}${session}`, {
        method:"GET",
        headers: {
        "Accept": "application/json",
        }
    }).then(response => response.json());
  
  
  export const getSignInMutation = <Credential> ({ signIn }:FooAuthEndpoints) => async <SessionType> (providerName:string, payload:(Credential & FooAuthApiRequestValidation)):Promise<FooAuthApiSessionResponse<SessionType>> => 
    fetch(`${basePath}${signIn}${providerName}`, {
        method:"POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(response => response.json());
  
  export const getSignOutMutation = ({ signOut }:FooAuthEndpoints) => async (payload:FooAuthApiRequestValidation):Promise<FooAuthApiSignOutResponse> => 
    fetch(`${basePath}${signOut}`, {
        method: 'POST',
        headers: {
            "Accept": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(response => response.json());
  
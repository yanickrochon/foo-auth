
import type {
    FooAuthApiRequestValidation,
    FooAuthApiCsrfTokenResponse,
    FooAuthApiSignOutResponse,
    FooAuthApiSessionResponse
} from '@foo-auth/core';


export type GetCsrfTokenQuery = {
    ():PromiseLike<FooAuthApiCsrfTokenResponse>;
};

export type GetSessionQuery = {
    <SessionType> ():PromiseLike<FooAuthApiSessionResponse<SessionType>>;
};

export type GetSignInMutation = {
    <Credential, SessionType> (providerName:string, payload:(Credential & FooAuthApiRequestValidation)): PromiseLike<FooAuthApiSessionResponse<SessionType>>;
};

export type GetSignOutMutation = {
    (payload:FooAuthApiRequestValidation): PromiseLike<FooAuthApiSignOutResponse>;
};

export type SessionProviderQueries = {
    csrfTokenQuery:GetCsrfTokenQuery;
    sessionQuery:GetSessionQuery;
    signInMutation:GetSignInMutation;
    signOutMutation:GetSignOutMutation;
};


export type SessionProviderContextValue<SessionType = any> = {
    session:SessionType;
    setSession(session:SessionType):void;
    queries:SessionProviderQueries;
};

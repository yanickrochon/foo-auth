

export type CsrfQueryValidation = {
    csrfToken:string;
};

export type ApiCsrfResponse = {
    csrfToken:string;
}

export type ApiSessionResponse<SessionType> = {
    success:boolean;
    session:SessionType | null;
    token?:string | null | undefined;
    redirect?:string | null | undefined;
};

export type ApiSignOutResponse = {
    success:boolean;
};


export type GetCsrfTokenQuery = {
    ():Promise<ApiCsrfResponse>;
};

export type GetSessionQuery<SessionType> = {
    ():Promise<ApiSessionResponse<SessionType>>;
};

export type GetSignInMutationOptions<Credential> = {
    providerName:string;
    payload:(Credential & CsrfQueryValidation)
};

export type GetSignInMutation<SessionType> = {
    <Credential> (options:GetSignInMutationOptions<Credential>): Promise<ApiSessionResponse<SessionType>>;
};

export type GetSignOutMutationOptions = {
    payload:CsrfQueryValidation;
};

export type GetSignOutMutation = {
    (options:GetSignOutMutationOptions): Promise<ApiSignOutResponse>;
};

export type SessionProviderQueries<SessionType> = {
    csrfTokenQuery:GetCsrfTokenQuery;
    sessionQuery:GetSessionQuery<SessionType>;
    signInMutation:GetSignInMutation<SessionType>;
    signOutMutation:GetSignOutMutation;
};


export type SessionProviderContextValue<SessionType> = {
    session:SessionType|null;
    clearSession():void;
    queries:SessionProviderQueries<SessionType>;
};

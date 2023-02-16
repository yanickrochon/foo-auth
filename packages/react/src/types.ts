import type {
  FooAuthApiCsrfResponse,
  FooAuthApiSessionResponse,
  FooAuthApiSignOutResponse,
} from "@foo-auth/core";

export type CsrfQueryValidation = {
  csrfToken: string;
};

export type ApiSignOutResponse = {
  success: boolean;
  redirect?: string;
};

export type GetCsrfTokenQuery = {
  (): Promise<FooAuthApiCsrfResponse>;
};

export type GetSessionQueryOptions = {
  autoRedirect?: false;
};

export type GetSessionQuery<SessionType> = {
  (options?: GetSessionQueryOptions): Promise<
    FooAuthApiSessionResponse<SessionType>
  >;
};

export type GetSignInMutationOptions<Credential> = {
  providerName: string;
  payload: Credential & CsrfQueryValidation;
  autoRedirect?: false;
};

export type GetSignInMutation<SessionType> = {
  <Credential>(options: GetSignInMutationOptions<Credential>): Promise<
    FooAuthApiSessionResponse<SessionType>
  >;
};

export type GetSignOutMutationOptions = {
  payload: CsrfQueryValidation;
};

export type GetSignOutMutation = {
  (options: GetSignOutMutationOptions): Promise<FooAuthApiSignOutResponse>;
};

export type SessionProviderQueries<SessionType> = {
  csrfTokenQuery: GetCsrfTokenQuery;
  sessionQuery: GetSessionQuery<SessionType>;
  signInMutation: GetSignInMutation<SessionType>;
  signOutMutation: GetSignOutMutation;
};

export type SessionProviderContextValue<SessionType> = {
  session: SessionType | null;
  clearSession(): void;
  queries: SessionProviderQueries<SessionType>;
};

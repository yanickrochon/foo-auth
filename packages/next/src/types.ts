import type {
  FooSessionInit,
  FooAuthProvider,
  FooAuthEndpoints,
  SecretKey,
} from "@foo-auth/core";

export type FooAuthPages = {
  home?: string | null | undefined;
  signin?: string | null | undefined;
  signout?: string | null | undefined;
  verify?: string | null | undefined;
};

export type NextFooAuthOptions<SessionType> = {
  session: FooSessionInit<SessionType>;
  providers: FooAuthProvider<SessionType>[];
  endpointPaths: FooAuthEndpoints;
  pages?: FooAuthPages;
  secretKey: SecretKey;
};

export type FooAuthPageProps<SessionType> = {
  session: SessionType;
  endpointPaths: FooAuthEndpoints;
};

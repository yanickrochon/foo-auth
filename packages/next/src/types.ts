import type {
  FooSessionInit,
  FooAuthProvider,
  FooAuthEndpoints,
  SecretKey
} from '@foo-auth/core';

export type NextFooAuthConfig<SessionType> = {
  session:FooSessionInit<SessionType>;
  providers:FooAuthProvider<SessionType>[];
  endpointPaths:FooAuthEndpoints;
  secretKey:SecretKey;
};

export type FooAuthPageProps<SessionType> = {
  session:SessionType;
  endpointPaths:FooAuthEndpoints;
};
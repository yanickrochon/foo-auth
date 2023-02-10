import type { FooAuthEndpoints } from "@foo-auth/core";

export const endpointPaths: FooAuthEndpoints = {
  callback: "/callback",
  csrfToken: "/csrf-token",
  session: "/session",
  signIn: "/sign-in",
  signOut: "/sign-out",
};

export const secret: string =
  "0c6136daeb78f8cd5cdc1eb963c3f83c5209494c2130b9cf9ab5e019146f0c1e";

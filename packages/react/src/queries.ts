import type {
  FooAuthApiSessionResponse,
  FooAuthEndpoints,
} from "@foo-auth/core";

import type {
  GetCsrfTokenQuery,
  GetSessionQuery,
  GetSignInMutation,
  GetSignOutMutation,
} from "./types";

const origin =
  process.env.NEXT_PUBLIC_ORIGIN ??
  (typeof window !== "undefined" ? window.location.origin : "");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const apiPath = process.env.NEXT_PUBLIC_API_PATH ?? "/api";

if (!origin && process.env.NODE_ENV === "development") {
  console.warn("Warning! Missing env variable NEXT_PUBLIC_ORIGIN");
}

export const getCsrfTokenQuery =
  ({ csrfToken }: FooAuthEndpoints): GetCsrfTokenQuery =>
  async () =>
    fetch(`${origin}${basePath}${apiPath}${csrfToken}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }).then((response) => response.json());

export const getSessionQuery =
  <SessionType>({ session }: FooAuthEndpoints): GetSessionQuery<SessionType> =>
  async (options) =>
    fetch(`${origin}${basePath}${apiPath}${session}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((result: FooAuthApiSessionResponse<SessionType>) => {
        if (result.redirect && options?.autoRedirect !== false) {
          window.location.href = result.redirect;
        }

        return result;
      });

export const getSignInMutation =
  <SessionType>({ signIn }: FooAuthEndpoints): GetSignInMutation<SessionType> =>
  async ({ providerName, payload, autoRedirect }) =>
    fetch(`${origin}${basePath}${apiPath}${signIn}/${providerName}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((result: FooAuthApiSessionResponse<SessionType>) => {
        if (result.redirect && autoRedirect !== false) {
          window.location.href = result.redirect;
        }

        return result;
      });

export const getSignOutMutation =
  ({ signOut }: FooAuthEndpoints): GetSignOutMutation =>
  async ({ payload }) =>
    fetch(`${origin}${basePath}${apiPath}${signOut}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((response) => response.json());

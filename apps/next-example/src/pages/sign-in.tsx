import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import clsx from "clsx";

import { withServerSideAuthProps } from "@foo-auth/next";
import { fooAuthOptions } from "../foo-auth.next";

import {
  useSessionQueries,
  type GetSignInMutationOptions,
} from "@foo-auth/react";

import { credentialsValidation } from "../schema/foo-auth";

import type { UserSession, UserCredentials } from "../types/foo-auth";

export const getServerSideProps = withServerSideAuthProps<UserSession>(
  fooAuthOptions,
  async ({ sessionProps }) => {
    return {
      props: {
        ...sessionProps,
        // add more props below....
      },
    };
  }
);

export default function SignInPage() {
  const queryClient = useQueryClient();
  const { csrfTokenQuery, signInMutation } = useSessionQueries<UserSession>();

  const { isLoading: csrfLoading, data: csrfData } = useQuery(
    ["csrf"],
    csrfTokenQuery,
    {
      refetchOnWindowFocus: false,
    }
  );

  // TODO : use type inference instead of proxying the query
  const signIn = useMutation(
    async (variables: GetSignInMutationOptions<UserCredentials>) =>
      signInMutation(variables),
    {
      onSuccess: () => {
        // Invalidate session
        queryClient.invalidateQueries("session");
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = Object.fromEntries(
      new FormData(e.target as HTMLFormElement).entries()
    );
    //const authType = data.authType as string;
    try {
      const payload = credentialsValidation.parse(data);

      signIn.mutate(
        {
          providerName: "credentials",
          payload,
        }
        //{ onSuccess(data) { } }
      );
    } catch (e) {
      console.log("ERR");
    }
  };

  return (
    <form
      className="flex justify-center items-center h-screen bg-gray-100 p-5"
      onSubmit={handleSubmit}
    >
      <div className="max-w-md w-full bg-white rounded p-6 space-y-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Sign in</h2>
        </div>
        <div>
          <input
            className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
            type="text"
            name="username"
            placeholder="john@email.com"
          />
        </div>
        <div>
          <input
            className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
            type="text"
            name="password"
            placeholder="1234"
          />
        </div>
        <CsrfInput loading={csrfLoading} csrfToken={csrfData?.csrfToken} />
        <AuthenticationType />
        <div>
          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold text-gray-50 transition duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    </form>
  );
}

const CsrfInput = ({
  loading,
  csrfToken,
}: {
  loading: boolean;
  csrfToken: string | null | undefined;
}) => {
  const title = loading
    ? "Loading..."
    : csrfToken
    ? "Ready"
    : "Missing CSRF token";

  return (
    <div className="flex items-start mb-6">
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={clsx("h-5", {
            "fill-gray-700": loading,
            "fill-blue-600 hover:fill-blue-700": !loading && csrfToken,
            "fill-red-600 hover:fill-red-700": !loading && !csrfToken,
          })}
        >
          <title>{title}</title>
          {loading ? (
            <path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
          ) : csrfToken ? (
            <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
          ) : (
            <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
          )}
        </svg>
      </div>
      <div className="text-sm ml-2">{title}</div>
      <input type="hidden" name="csrfToken" value={csrfToken || ""} />
    </div>
  );
};

const AuthenticationType = () => {
  return (
    <>
      <div className="flex items-start pt-3">
        <div className="flex items-center h-5">
          <input
            id="authTypeCookie"
            name="authType"
            aria-describedby="authTypeCookie"
            type="radio"
            className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-blue-300 rounded h-4 w-4"
            value="cookies"
            checked
            readOnly
          />
        </div>
        <div className="text-sm ml-3">
          <label htmlFor="authTypeCookie" className="font-medium text-gray-900">
            Use cookies
          </label>
        </div>
      </div>
      <div className="flex items-start pb-3">
        <div className="flex items-center h-5">
          <input
            id="authTypeJWT"
            name="authType"
            aria-describedby="authTypeJWT"
            type="radio"
            className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded"
            value="jwt"
            disabled
          />
        </div>
        <div className="text-sm ml-3">
          <label htmlFor="authTypeJWT" className="font-medium text-gray-900">
            Use Web Tokens
          </label>
        </div>
      </div>
    </>
  );
};

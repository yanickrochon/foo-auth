// import { useMutation, useQuery, useQueryClient } from "react-query";

// import clsx from "clsx";

import { getSessionPageProps } from "@foo-auth/next";
import {
  fooAuthConfig,
  //type UserCredentials,
  //type SessionType,
} from "../config/foo-auth.config";

import { useRouter } from "next/router";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
//import type { SyntheticEvent } from "react";

// import {
//   useSessionQueries,
//   type GetSignInMutationOptions,
// } from "@foo-auth/react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getSessionPageProps(
    { context, config: fooAuthConfig },
    async (sessionPageProps) => ({
      props: {
        ...sessionPageProps,
        // add more props below....
      },
    })
  );
};

export default function IndexPage() {
  const router = useRouter();
  return (
    <>
      <h2 className="text-2xl">Authentified!</h2>
      <p>(Destroy session cookie and refresh.)</p>
    </>
  );
}

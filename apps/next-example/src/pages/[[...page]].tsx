// import { useMutation, useQuery, useQueryClient } from "react-query";

// import clsx from "clsx";

import { getSessionPageProps } from "@foo-auth/next";
import { fooAuthOptions } from "../foo-auth.next";

import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getSessionPageProps(
    { context, config: fooAuthOptions },
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

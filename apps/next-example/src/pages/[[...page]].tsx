import { withServerSideAuthProps } from "@foo-auth/next";
import { useSession } from "@foo-auth/react";

import { fooAuthOptions } from "../foo-auth.next";

import type { UserSession } from "../types/foo-auth";

export const getServerSideProps = withServerSideAuthProps<UserSession>(
  fooAuthOptions,
  async (context) => {
    return {
      props: {
        ...context.sessionProps,
        // add more props below....
      },
    };
  }
);

export default function IndexPage() {
  const session = useSession<UserSession>();
  const fullName = session?.user
    ? `${session.user.firstName} ${session.user.lastName}`
    : "Guest";

  return (
    <>
      <h2 className="text-2xl">Hello {fullName} !</h2>
      <p>(Destroy session cookie and refresh.)</p>
    </>
  );
}

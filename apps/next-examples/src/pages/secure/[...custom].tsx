import type { GetServerSideProps, NextPage, Redirect } from "next";

type CustomPageProps = {
  customPage: string[];
};

const getServerSideProps: GetServerSideProps<
  CustomPageProps | Redirect
> = async ({ params }) => {
  const customPage: string[] = (params?.custom as string[]) ?? [];

  return customPage.length
    ? {
        props: {
          customPage,
        },
      }
    : {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
};

const CustomPage: NextPage<CustomPageProps> = ({
  customPage,
}: CustomPageProps) => {
  return <div>Page : {JSON.stringify(customPage)}</div>;
};

export default CustomPage;
export { getServerSideProps };

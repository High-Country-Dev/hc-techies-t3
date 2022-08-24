import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import React from "react";
import { useQueryClient } from "react-query";
import Link from "next/link";

const Login: NextPage = () => {
  // const { data: session } = useSession()
  const queryClient = useQueryClient();
  const utils = trpc.useContext();
  const { data: self } = trpc.useQuery(["self.get"]);
  // const { mutate: createUser } = trpc.useMutation(['create-user'], {
  //   onSuccess: () => utils.invalidateQueries('users'),
  // })
  // const { mutate: deleteUsers } = trpc.useMutation(['delete-all-users'], {
  //   onSuccess: () => utils.invalidateQueries('users'),
  // })
  // const { data: users } = trpc.useQuery(['users'])
  const { mutate: login } = trpc.useMutation(["auth.login"], {
    onSuccess: (data) => {
      sessionStorage.setItem("access_token", data.accessToken);
      sessionStorage.setItem("refresh_token", data.refreshToken);
      utils.invalidateQueries("self.get");
      utils.setQueryData(["self.get"], data.user);
    },
  });
  const { mutate: signup } = trpc.useMutation(["auth.signup"], {
    onSuccess: (data) => {
      sessionStorage.setItem("access_token", data.accessToken);
      sessionStorage.setItem("refresh_token", data.refreshToken);
      utils.invalidateQueries("self.get");
      utils.setQueryData(["self.get"], data.user);
    },
  });
  const { mutate: logout } = trpc.useMutation(["auth.logout"], {
    onSuccess: () => {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      utils.invalidateQueries("self.get");
      queryClient.clear();
    },
  });
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4 max-w-xl">
        <h1 className="text-2xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          {self ? (
            <>
              Welcome <span className="text-blue-300">{self.email}</span>
            </>
          ) : (
            <span>Please Login</span>
          )}
        </h1>

        {!self ? (
          <>
            <input
              className="m-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="m-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className=" m-2bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={() => login({ email, password })}
            >
              Sign In
            </button>
            <button
              className="m-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={() => signup({ email, password })}
            >
              Sign Up
            </button>
          </>
        ) : (
          <button
            className="m-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={() => logout()}
          >
            Logout
          </button>
        )}
        <Link
          className="m-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          href={"/"}
        >
          Return Home
        </Link>
      </main>
    </>
  );
};

export default Login;

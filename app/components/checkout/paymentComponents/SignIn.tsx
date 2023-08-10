"use client";
import React from "react";
import { getProviders, useSession, signIn, signOut } from "next-auth/react";
import { DisplayStates } from "../Payment";

interface Props {
  setDisplayState: React.Dispatch<React.SetStateAction<DisplayStates>>;
}

export default function SignIn({ setDisplayState }: Props) {
  const { data: session, status } = useSession();

  const [providers, setProviders] = React.useState<any[]>([]);

  getProviders().then((res) => {
    setProviders(Object.values(res || {}));
  });

  function Login() {
    setDisplayState("loadingCP");
    signIn(providers[0].id); // github, first provider
    // get your own page here: https://next-auth.js.org/configuration/pages
  }

  if (status === "authenticated") {
    return (
      <div>
        <h1>Hello {session.user?.name}!</h1>
      </div>
    );
  } else {
    // SHOW LOGIN STUFF
    return (
      <div>
        <button onClick={Login}>GITHUB LOGIN</button>
      </div>
    );
  }
}

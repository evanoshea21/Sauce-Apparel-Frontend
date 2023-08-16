"use client";
import React from "react";
import { getProviders, useSession, signIn } from "next-auth/react";
import { DisplayStates } from "../Payment";
import classes from "@/styles/Payment.module.css";

interface Props {
  setDisplayState?: React.Dispatch<React.SetStateAction<DisplayStates>>;
  setDisplayHome?: React.Dispatch<React.SetStateAction<"loading" | undefined>>;
}

export default function SignIn({ setDisplayState, setDisplayHome }: Props) {
  const { data: session, status } = useSession();

  const [providers, setProviders] = React.useState<any[]>([]);

  getProviders().then((res) => {
    setProviders(Object.values(res || {}));
  });

  function Login() {
    if (setDisplayState) {
      setDisplayState("loadingCP");
    }
    if (setDisplayHome) {
      setDisplayHome("loading");
    }

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
      <div className={classes.signinMain}>
        {setDisplayState ? (
          <h2>Log in to Complete Purchase</h2>
        ) : (
          <h2 style={{ margin: "20px", textAlign: "center" }}>
            Log in to Profile
          </h2>
        )}
        <button className={classes.githubBtn} onClick={Login}>
          GITHUB
        </button>
        <button className={classes.googleBtn}>GOOGLE (non-op rn)</button>
        <button className={classes.facebookBtn}>FACEBOOK (non-op rn)</button>
      </div>
    );
  }
}

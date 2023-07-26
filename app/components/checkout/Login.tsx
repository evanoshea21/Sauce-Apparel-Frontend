"use client";
import React from "react";
import classes from "@/styles/Checkout.module.css";

import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginReg() {
  const { data: session, status } = useSession();
  console.log("Session, status: \n", session, status);

  function Login() {
    // how to login with github......
    signIn();
    // get your own page here: https://next-auth.js.org/configuration/pages
  }
  function Logout() {
    // how to login with github......
    signOut();
    // get your own page here: https://next-auth.js.org/configuration/pages
  }

  if (status === "authenticated") {
    return (
      <div className={classes.mainLoggedIn}>
        <h3>Logged In!</h3>
        <p>User name: {session.user?.name}</p>
        <img width="80px" alt="profile image" src={session.user?.image!} />
        <p>User email: {session.user?.email}</p>
        <button onClick={Logout}>Github Logout</button>
      </div>
    );
  } else {
    return (
      <div className={classes.mainLoggedOut}>
        <h3>Logged Out..</h3>
        <button onClick={Login}>Login</button>
        {/* <button onClick={Logout}>LOGOUT CONFIRM</button> */}
      </div>
    );
  }
}

// export default function LoginReg() {
//   return <div>Login Reg</div>;
// }

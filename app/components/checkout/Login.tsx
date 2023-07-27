"use client";
import React from "react";
import classes from "@/styles/Checkout.module.css";
import { getProviders, useSession, signIn, signOut } from "next-auth/react";

/*
Sole purpose:
- Handle Sign in/Sign Out

CLEAN

Left to do:
- UI for each provider button
- loading state for logout
*/

// { sessionGlobal, setSession }: Props
export default function LoginReg() {
  const [providers, setProviders] = React.useState<any[]>([]);
  // console.log("Session, status: \n", session, status);

  const { data: session, status } = useSession();
  getProviders().then((res) => {
    setProviders(Object.values(res || {}));
  });

  function Login() {
    //github login (get first provider's id)
    signIn(providers[0].id);
    // get your own page here: https://next-auth.js.org/configuration/pages
  }
  function Logout() {
    signOut();
  }

  // HELLO BOB! ... customer profile below
  if (status === "authenticated") {
    return (
      <div className={classes.mainLoggedIn}>
        <h1>OAuth</h1>
        <p>User name: {session.user?.name}</p>
        <img width="80px" alt="profile image" src={session.user?.image!} />
        <p>User email: {session.user?.email}</p>
        <button onClick={Logout}>GITHUB Logout</button>
      </div>
    );
  } else {
    // SHOW LOGIN STUFF
    return (
      <div className={classes.mainLoggedOut}>
        <h1>OAuth</h1>
        <p>logged out...</p>
        <button onClick={Login}>GITHUB Login</button>
        {/* <button onClick={Logout}>LOGOUT CONFIRM</button> */}
      </div>
    );
  }
}

// export default function LoginReg() {
//   return <div>Login Reg</div>;
// }

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
      <>
        <div className={classes.signinMain}>
          {setDisplayState ? (
            <>
              <h2>Add Payment</h2>
              <h3>Log in to Complete Purchase</h3>
              <p>Save your payment methods for a quicker checkout.</p>
            </>
          ) : (
            <h2 style={{ margin: "20px", textAlign: "center" }}>
              Log in to Profile
            </h2>
          )}
          <button className={classes.githubBtn} onClick={Login}>
            GITHUB
          </button>
          <button className={classes.googleBtn}>
            <img className={classes.googleIcon} src="google.png" />
            <div>Continue with Google</div>
          </button>
          <button className={classes.facebookBtn}>
            <img className={classes.fbIcon} src="fb.png" />
            <div>Continue with Facebook</div>
          </button>
        </div>
        {setDisplayState && (
          <div className={classes.guestCheckout}>
            <div className={classes.divider}>
              <span>or</span>
            </div>
            <h3>Guest Checkout</h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={() => setDisplayState("guestCard")}
                className={classes.guestBtn}
              >
                Continue as Guest
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
}

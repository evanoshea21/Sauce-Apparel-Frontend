"use client";
import React from "react";
import { getProviders, useSession, signIn } from "next-auth/react";
import { DisplayStates } from "../Payment";
import classes from "@/styles/Payment.module.css";

interface Props {
  setDisplayState?: React.Dispatch<React.SetStateAction<DisplayStates>>;
  setDisplayHome?: React.Dispatch<React.SetStateAction<"loading" | undefined>>;
  isModal?: boolean;
}

export default function SignIn({
  setDisplayState,
  setDisplayHome,
  isModal,
}: Props) {
  const { data: session, status } = useSession();

  const [providers, setProviders] = React.useState<any[]>([]);
  const [warningOpacity, setWarningOpacity] = React.useState("0");

  React.useEffect(() => {
    if (warningOpacity === "1") {
      setTimeout(() => {
        setWarningOpacity("0");
      }, 5500);
    }
  }, [warningOpacity]);

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
          <button
            onClick={() => setWarningOpacity("1")}
            className={classes.googleBtn}
          >
            <img className={classes.googleIcon} src="google.png" />
            <div>Continue with Google</div>
          </button>
          <button
            onClick={() => setWarningOpacity("1")}
            className={classes.facebookBtn}
          >
            <img className={classes.fbIcon} src="fb.png" />
            <div>Continue with Facebook</div>
          </button>
          <p
            style={{
              opacity: warningOpacity,
              color: "red",
              transition:
                warningOpacity === "1"
                  ? "height 1.4s ease, opacity 1.4s ease .5s"
                  : "height 1.4s ease .5s, opacity 1.4s ease",
              margin: "0",
              padding: "0",
              fontSize: isModal ? "12px" : "1em",
              // border: "1px solid red",
              height: warningOpacity === "1" ? "40px" : "20px",
            }}
          >
            Google and Facebook OAuth is currently disabled as this is a demo
            site. Please login with Github or use Guest checkout.
          </p>
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

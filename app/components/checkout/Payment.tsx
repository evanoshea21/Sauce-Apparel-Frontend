"use client";
import classes from "@/styles/Payment.module.css";
import React from "react";
import axios from "axios";
import type { CustomerProfile } from "@/scripts/Types";
import { useSession } from "next-auth/react";
// Components
import AddCardProfile from "./paymentComponents/AddCardProfile";
import ChooseCard from "./paymentComponents/ChooseCard";
import SignIn from "./paymentComponents/SignIn";
import GuestCard, { GuestPayment } from "./paymentComponents/GuestCard";
import type { Payment } from "./index";
import Button from "@mui/material/Button";

interface Props {
  setPayment: React.Dispatch<React.SetStateAction<Payment | undefined>>;
  setGuestPayment: React.Dispatch<
    React.SetStateAction<GuestPayment | undefined>
  >;
  setCustomerProfileId: React.Dispatch<React.SetStateAction<string>>;
  customerProfileId: string;
}

export type DisplayStates =
  | "loggedOut" // LOG IN
  | "loadingCP" // loading
  | "invalidCard" // error
  | "networkError" // error
  | "chooseCard" // CHOOSE CARD-add card option inside
  | "addCard" // ADD CARD
  | "guestCard"; // Guest Checkout

export default function Payment({
  setPayment,
  setGuestPayment,
  customerProfileId,
  setCustomerProfileId,
}: Props) {
  //session updates on refresh
  const { data: session, status } = useSession();
  // local state for Payment Cards
  const [customerProfile, setCustomerProfile] =
    React.useState<CustomerProfile>();
  const [chosenPayment, setChosenPayment] = React.useState<Payment>();
  const [displayState, setDisplayState] =
    React.useState<DisplayStates>("loadingCP");
  const [refetchAllCustomer, setRefetchAllCustomer] =
    React.useState<boolean>(true);
  const [refreshCustomer, setRefreshCustomer] = React.useState<boolean>(true);

  // Attempt to GetSet CustomerProfile&id after initial login
  React.useEffect(() => {
    // might have issues re-fetching when you change TAB and come back..
    if (status === "authenticated" && !customerProfile) {
      console.log("running FETCH PROFILE... from status change");
      setDisplayState("loadingCP");
      axios({
        // check DB for profileId
        url: "/api/get-profile-by-userid",
        method: "POST",
        data: { userId: session.user.id },
      })
        .then((res) => {
          // then, setId, and getSetProfileById from SDK
          setCustomerProfileId(res.data.customerProfileId);
          getCustomerProfile(res.data.customerProfileId)
            .then((res: CustomerProfile) => {
              setCustomerProfile(res); // set customerProfile*
              console.log("GOT CustomerProfile from LOGIN: ", res);
            })
            .catch((e) => {
              // if user DNE, route to AddCardProfile
              if (e.response.data === "user DNE") {
                setDisplayState("chooseCard");
              } else {
                console.error("error getting profile (in refetch): ", e);
                setDisplayState("networkError");
              }
            });
        })
        .catch((e) => {
          // if userId not in DB, route to AddCardProfile
          if (e.response.data === "user DNE") {
            setDisplayState("chooseCard");
          } else {
            setDisplayState("networkError");
          }
        });
    } else if (status === "unauthenticated") {
      // not logged in
      setDisplayState("loggedOut");
    }
  }, [status, refetchAllCustomer]);

  React.useEffect(() => {
    if (status === "authenticated" && customerProfileId) {
      getCustomerProfile(customerProfileId)
        .then((res) => {
          setCustomerProfile(res);
        })
        .catch((e) => {
          // if user DNE, route to AddCardProfile
          if (e.response.data === "user DNE") {
            setDisplayState("chooseCard");
          } else {
            console.error("error getting profile: ", e);
            setDisplayState("networkError");
          }
        });
    }
  }, [refreshCustomer]);

  //see updates to chosen card, pass it UP to Checkout
  React.useEffect(() => {
    if (chosenPayment) {
      setPayment(chosenPayment);
    }
  }, [chosenPayment]);

  // CHOOSE CARD if customerProfile defined
  React.useEffect(() => {
    if (customerProfile) {
      setDisplayState("chooseCard");
    }
  }, [customerProfile]);

  // after deleting profile..
  function reset() {
    setCustomerProfile(undefined);
    setCustomerProfileId("");
    setChosenPayment(undefined);
    setPayment(undefined);
    setDisplayState("chooseCard");
  }

  if (displayState === "loadingCP") {
    return (
      <h2
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className={classes.main}
      >
        Loading...
      </h2>
    );
  }
  if (displayState === "networkError") {
    return (
      <div className={classes.main}>
        <h2>Oops. Network Error, try again.</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setDisplayState("addCard");
            }}
          >
            Try Again.
          </Button>
        </div>
      </div>
    );
  }
  if (displayState === "invalidCard") {
    return (
      <div className={classes.main}>
        <h2>Invalid Card Entered.</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Button
            style={{ width: "200px", margin: "10px auto 0 auto" }}
            variant="contained"
            onClick={() => {
              setDisplayState("addCard");
            }}
          >
            Try Again.
          </Button>
          <Button
            style={{ width: "200px", margin: "10px auto 0 auto" }}
            variant="outlined"
            onClick={() => {
              setDisplayState("chooseCard");
            }}
          >
            Return to Payment.
          </Button>
        </div>
      </div>
    );
  }

  if (displayState === "loggedOut") {
    return (
      <div className={classes.main}>
        <SignIn setDisplayState={setDisplayState} />
      </div>
    );
  }
  if (displayState === "guestCard") {
    return (
      <div className={classes.main}>
        <GuestCard
          setDisplayState={setDisplayState}
          setGuestPayment={setGuestPayment}
        />
      </div>
    );
  }
  if (displayState === "addCard") {
    return (
      <div className={classes.main}>
        <AddCardProfile
          existingCustomerProfile={customerProfile}
          setRefetchAllCustomer={setRefetchAllCustomer}
          setRefreshCustomer={setRefreshCustomer}
          setDisplayState={setDisplayState}
          session={session}
        />
      </div>
    );
  }
  return (
    <div className={classes.main}>
      <ChooseCard
        customerProfile={customerProfile}
        chosenPayment={chosenPayment}
        setChosenPayment={setChosenPayment}
        setDisplayState={setDisplayState}
        reset={reset}
      />
    </div>
  );
}

// UTIL FUNCTION
async function getCustomerProfile(id: string): Promise<CustomerProfile> {
  return new Promise((resolve, reject) => {
    axios({
      url: `${process.env.NEXT_PUBLIC_SDK_SERVER_BASE_URL}/getprofile`,
      method: "POST",
      data: { id },
    })
      .then((res) => {
        resolve(res.data.profile);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

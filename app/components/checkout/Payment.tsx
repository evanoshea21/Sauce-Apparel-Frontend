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

interface Props {
  setPaymentProfileId: React.Dispatch<React.SetStateAction<string>>;
  setCustomerProfileId: React.Dispatch<React.SetStateAction<string>>;
  customerProfileId: string;
}

export type DisplayStates =
  | "loggedOut" // LOG IN
  | "loadingCP" // loading
  | "networkError" // error
  | "chooseCard" // CHOOSE CARD-add card option inside
  | "addCard"; // ADD CARD

export default function Payment({
  setPaymentProfileId,
  customerProfileId,
  setCustomerProfileId,
}: Props) {
  //session updates on refresh
  const { data: session, status } = useSession();
  // local state for Payment Cards
  const [customerProfile, setCustomerProfile] =
    React.useState<CustomerProfile>();
  const [chosenPaymentId, setChosenPaymentId] = React.useState<string>("");
  const [displayState, setDisplayState] =
    React.useState<DisplayStates>("loggedOut");
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
    if (chosenPaymentId) {
      setPaymentProfileId(chosenPaymentId);
    }
  }, [chosenPaymentId]);

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
    setChosenPaymentId("");
    setDisplayState("chooseCard");
  }

  if (displayState === "loadingCP") {
    return <div className={classes.main}>Loading your Profile...</div>;
  }
  if (displayState === "networkError") {
    return (
      <div className={classes.main}>
        Network Error: Couldn't retrieve your profile. Try again later.
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
  if (displayState === "addCard") {
    return (
      <div className={classes.main}>
        <AddCardProfile
          existingCustomerProfile={customerProfile}
          setRefetchAllCustomer={setRefetchAllCustomer}
          setRefreshCustomer={setRefreshCustomer}
          setDisplayState={setDisplayState}
          setChosenPaymentId={setChosenPaymentId}
          session={session}
        />
      </div>
    );
  }
  return (
    <div className={classes.main}>
      <ChooseCard
        customerProfile={customerProfile}
        chosenPaymentId={chosenPaymentId}
        setChosenPaymentId={setChosenPaymentId}
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
      url: "http://localhost:1400/getprofile",
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

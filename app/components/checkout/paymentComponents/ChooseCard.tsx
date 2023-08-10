"use client";
import React from "react";
import { Add } from "@mui/icons-material";
import type { CustomerProfile } from "@/scripts/Types";
import classes from "@/styles/Payment.module.css";
import { DisplayStates } from "../Payment";
import axios from "axios";

interface Props {
  customerProfile: CustomerProfile | undefined;
  chosenPaymentId: string;
  setChosenPaymentId: React.Dispatch<React.SetStateAction<string>>;
  setDisplayState: React.Dispatch<React.SetStateAction<DisplayStates>>;
  reset: () => void;
}

export default function ChooseCard({
  customerProfile,
  chosenPaymentId,
  setChosenPaymentId,
  setDisplayState,
  reset,
}: Props) {
  function deleteProfile() {
    if (!customerProfile) return;
    axios({
      url: "http://localhost:1400/deleteprofile",
      method: "DELETE",
      data: {
        customerId: customerProfile.customerProfileId,
      },
    })
      .then((res) => {
        console.log("Successfully Deleted SDK: ", res.data);
        axios({
          url: "/api/save-customer-profile",
          method: "DELETE",
          data: { customerProfileId: customerProfile.customerProfileId },
        })
          .then((res) => {
            console.log("Also Deleted from your DB");
            reset();
          })
          .catch((e) => console.error("Couldnt delete from your DB"));
      })
      .catch((e) => console.error("Error deleting: ", e));
  }

  return (
    <div>
      {customerProfile &&
        customerProfile.paymentProfiles.map((card) => (
          <div
            key={card.customerPaymentProfileId}
            className={classes.card}
            onClick={() => setChosenPaymentId(card.customerPaymentProfileId)}
            style={{
              backgroundColor:
                chosenPaymentId === card.customerPaymentProfileId ? "grey" : "",
            }}
          >
            {card.payment.creditCard.cardNumber}
          </div>
        ))}
      <button onClick={() => setDisplayState("addCard")}>Add card</button>
      {customerProfile && (
        <button onClick={deleteProfile}>DELETE PROFILE</button>
      )}
    </div>
  );
}

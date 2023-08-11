"use client";
import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
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
  React.useEffect(() => {
    if (customerProfile) {
      setChosenPaymentId(
        customerProfile.paymentProfiles[0].customerPaymentProfileId
      );
    }
  }, [customerProfile]);

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
    <div className={classes.chooseMain}>
      <h2>Payment Method</h2>
      <div className={classes.cardOptions}>
        {customerProfile &&
          customerProfile.paymentProfiles.map((card) => (
            <div
              key={card.payment.creditCard.cardNumber}
              className={classes.border}
              style={{
                border:
                  chosenPaymentId === card.customerPaymentProfileId
                    ? "5px solid #7097e5"
                    : "5px solid transparent",
              }}
            >
              <div
                key={card.customerPaymentProfileId}
                className={classes.card}
                onClick={() =>
                  setChosenPaymentId(card.customerPaymentProfileId)
                }
                style={{
                  backgroundColor:
                    chosenPaymentId === card.customerPaymentProfileId
                      ? "#434258"
                      : "",
                }}
              >
                <span>{card.payment.creditCard.cardType}</span>
                <span className={classes.cardNum}>
                  •• {card.payment.creditCard.cardNumber.slice(-4)}
                </span>
              </div>
            </div>
          ))}
        <div
          className={classes.border}
          style={{
            border: "5px solid transparent",
          }}
        >
          <div
            className={classes.addCard}
            onClick={() => setDisplayState("addCard")}
          >
            <AddCircleOutlineIcon />
            <span>New Card</span>
          </div>
        </div>
      </div>
      {customerProfile && (
        <button onClick={deleteProfile}>DELETE PROFILE</button>
      )}
    </div>
  );
}

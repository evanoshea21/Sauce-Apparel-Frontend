"use client";
import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import type { CustomerProfile } from "@/scripts/Types";
import classes from "@/styles/Payment.module.css";
import { DisplayStates } from "../Payment";
import axios from "axios";
import type { Payment } from "../index";

interface Props {
  customerProfile: CustomerProfile | undefined;
  chosenPayment: Payment | undefined;
  setChosenPayment: React.Dispatch<React.SetStateAction<Payment | undefined>>;
  setDisplayState: React.Dispatch<React.SetStateAction<DisplayStates>>;
  reset: () => void;
}

export default function ChooseCard({
  customerProfile,
  chosenPayment,
  setChosenPayment,
  setDisplayState,
  reset,
}: Props) {
  React.useEffect(() => {
    if (customerProfile) {
      const paymentProfileId: string =
        customerProfile.paymentProfiles[0].customerPaymentProfileId;
      const cardType: string =
        customerProfile.paymentProfiles[0].payment.creditCard.cardType;
      const cardNumber: string =
        customerProfile.paymentProfiles[0].payment.creditCard.cardNumber;
      const expDate: string =
        customerProfile.paymentProfiles[0].payment.creditCard.expirationDate;
      let obj = { cardNumber, cardType, expDate, paymentProfileId };
      setChosenPayment(obj);
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
                  chosenPayment?.paymentProfileId ===
                  card.customerPaymentProfileId
                    ? "5px solid #7097e5"
                    : "5px solid transparent",
              }}
            >
              <div
                key={card.customerPaymentProfileId}
                className={classes.card}
                onClick={() => {
                  const paymentProfileId = card.customerPaymentProfileId;
                  const cardNumber = card.payment.creditCard.cardNumber;
                  const cardType = card.payment.creditCard.cardType;
                  const expDate = card.payment.creditCard.expirationDate;
                  let obj = { cardNumber, expDate, cardType, paymentProfileId };
                  setChosenPayment(obj);
                }}
                style={{
                  backgroundColor:
                    chosenPayment?.paymentProfileId ===
                    card.customerPaymentProfileId
                      ? "#434258"
                      : "",
                }}
              >
                <span className={classes.cardTypeInCard}>
                  {card.payment.creditCard.cardType === "AmericanExpress"
                    ? "Amex"
                    : card.payment.creditCard.cardType}
                </span>
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

      {/* FOR TESTING (DELETE PROFILE) */}
      {/* {customerProfile && (
        <button onClick={deleteProfile}>DELETE PROFILE</button>
      )} */}
    </div>
  );
}

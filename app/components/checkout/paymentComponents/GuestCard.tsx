"use client";
import React from "react";
import { getProviders, useSession, signIn } from "next-auth/react";
import { DisplayStates } from "../Payment";
import classes from "@/styles/GuestCard.module.css";
import type { ChargeCardData } from "@/scripts/Types";
import TextInput from "@/app/components/ui/TextInput";
import CardNumberInput from "@/app/components/ui/CreditInput";
import ExpDateInput from "@/app/components/ui/ExpDateInput";
import CvvInput from "@/app/components/ui/CvvInput";
import { CreditCard } from "@mui/icons-material";

interface Props {
  setDisplayState: React.Dispatch<React.SetStateAction<DisplayStates>>;
  setGuestPayment: React.Dispatch<
    React.SetStateAction<GuestPayment | undefined>
  >;
}

export type GuestPayment = Omit<
  ChargeCardData,
  "invoiceNum" | "description" | "amount" | "ordered_items"
>;

export default function GuestCard({ setDisplayState, setGuestPayment }: Props) {
  const [view, setView] = React.useState<"form" | "review">("form");
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();
  const [cardNumber, setCardNumber] = React.useState<string>("");
  const [expDate, setExpDate] = React.useState<string>("");
  const [cvv, setCvv] = React.useState<string>("");
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [state, setState] = React.useState<string>("");
  const [zip, setZip] = React.useState<string>("");

  React.useEffect(() => {
    console.log("expDate: ", expDate);
  }, [expDate]);

  function sendForm() {
    let formData: GuestPayment = {
      creditCard: {
        cardNumber,
        expDate,
        cvv,
      },
      billTo: {
        firstName,
        lastName,
        address,
        city,
        state,
        zip,
        country: "US",
      },
    };
    // VERIFY FORM
    const formValidation = validateForm(formData);
    if (formValidation !== "ok") {
      setErrorMessage(formValidation);
      return;
    }
    console.log("form inputs look good");

    // successful form inputs..
    setErrorMessage(undefined);

    let guestPaymentPayload: GuestPayment = {
      creditCard: {
        cardNumber,
        expDate,
        cvv,
      },
      billTo: {
        firstName,
        lastName,
        address,
        city,
        state,
        zip,
        country: "US",
      },
    };
    setGuestPayment(guestPaymentPayload);

    setView("review");
  }

  return (
    <div className={classes.main}>
      {/* REVIEW */}
      <div
        style={{ display: view === "review" ? "block" : "none" }}
        className={classes.mainReview}
      >
        <span>This is the review page of form elements</span>
        <div>F Name: {firstName}</div>
        <div>L Name: {lastName}</div>
        <div>Card: **{cardNumber.slice(-4)}</div>
        <button onClick={() => setView("form")}>Return to form</button>
      </div>

      {/* FORM */}
      <div
        style={{ display: view === "form" ? "block" : "none" }}
        className={classes.form}
      >
        <h2>Guest Checkout</h2>
        <button
          className={classes.returnSignInBtn}
          onClick={() => setDisplayState("loggedOut")}
        >
          Back
        </button>
        <div className={classes.form}>
          <TextInput
            inputId="guestPayment-firstName"
            onChange={setFirstName}
            placeholder="First Name"
          />
          <TextInput
            inputId="guestPayment-lastName"
            onChange={setLastName}
            placeholder="Last Name"
          />
          <TextInput
            inputId="guestPayment-streetAddress"
            onChange={setAddress}
            placeholder="Street Address"
          />
          <TextInput
            inputId="guestPayment-city"
            onChange={setCity}
            placeholder="City"
          />
          <TextInput
            inputId="guestPayment-state"
            onChange={setState}
            placeholder="State"
            maxLength={2}
          />
          <TextInput
            inputId="guestPayment-zip"
            onChange={setZip}
            placeholder="Zip"
          />
          <CardNumberInput onChange={setCardNumber} />
          <ExpDateInput onChange={setExpDate} />
          <CvvInput onChange={setCvv} />
        </div>
        {errorMessage && <p style={{ color: "red" }}>Error: {errorMessage}</p>}
        <button onClick={sendForm}>Verify form</button>
      </div>
    </div>
  );
}

function validateForm(data: GuestPayment): string {
  // first make sure billTo is filled in
  let errorToBe: string =
    "Please fill in all fields. Current fields are empty: ";
  const emptyFields: string[] = [];
  let isError = false;
  if (data.billTo.firstName.length == 0) {
    emptyFields.push("First Name");
    isError = true;
  }
  if (data.billTo.lastName.length == 0) {
    emptyFields.push("Last Name");
    isError = true;
  }
  if (data.billTo.address.length == 0) {
    emptyFields.push("Address");
    isError = true;
  }
  if (data.billTo.city.length == 0) {
    emptyFields.push("City");
    isError = true;
  }
  if (data.billTo.state.length == 0) {
    emptyFields.push("State");
    isError = true;
  }
  if (data.billTo.zip.length == 0) {
    emptyFields.push("Zip Code");
    isError = true;
  }

  if (isError) {
    emptyFields.forEach((field) => {
      errorToBe += field + ", ";
    });
    errorToBe = errorToBe.slice(0, -2);
    return errorToBe;
  }

  // double check zip
  let zip = data.billTo.zip;
  if (isNaN(zip)) return "Only numbers are valid for 'Zip Code'";
  if (data.billTo.state.length < 2) {
    return "Please provide 2 characters for 'State'";
  }
  if (data.billTo.zip.length < 5) {
    return "Please provide at least 5 characters for 'Zip Code'";
  }

  // NOW check credit card number
  let cardNum = data.creditCard.cardNumber;
  if (cardNum.length < 13) {
    return "Invalid Credit Card Length";
  }
  // also make sure each char is a number
  if (isNaN(cardNum)) return "Only numbers are valid for 'Credit Card Number'";

  // check creditCard ExpDate
  let expDate = data.creditCard.expDate;
  if (expDate.length < 4) {
    return "Invalid Expiration Date";
  }
  if (isNaN(expDate.replace("/", "")))
    return "Only numbers are valid for 'Expiration Date'";

  // check creditCard CVV
  let cvv = data.creditCard.cvv;
  if (cvv.length < 3) {
    return "Invalid CVV Length";
  }
  if (isNaN(cvv)) return "Only numbers are valid for 'CVV'";

  return "ok";
}

function isNaN(input: string): boolean {
  let isNaN = false;

  for (let i = 0; i < input.length; i++) {
    let char = input[i];
    let val = Number(char);
    if (Number.isNaN(val)) {
      isNaN = true;
      break;
    }
  }

  return isNaN;
}

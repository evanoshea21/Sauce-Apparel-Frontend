"use client";
import React from "react";
import { DisplayStates } from "../Payment";
import classes from "@/styles/GuestCard.module.css";
import type { ChargeCardData } from "@/scripts/Types";
import TextInput from "@/app/components/ui/TextInput";
import CardNumberInput from "@/app/components/ui/CreditInput";
import ExpDateInput from "@/app/components/ui/ExpDateInput";
import CvvInput from "@/app/components/ui/CvvInput";
import { BillToForm } from "../../forms/AddCardForms";
import Button from "@mui/material/Button";

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
  const [_phone, setUnusedPhone] = React.useState<string>("");

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

    // Successful form inputs..
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
        <h2>Review Payment</h2>
        <div className={classes.reviewInfo}>
          <div className={classes.row}>
            <span>First Name: </span>
            <span>{firstName}</span>
          </div>
          <div className={classes.row}>
            <span>Last Name: </span>
            <span>{lastName}</span>
          </div>
          <div className={classes.row}>
            <span>Street: </span>
            <span
              style={{
                inlineSize: "130px",
                wordBreak: "break-word",
              }}
            >
              {address}
            </span>
          </div>
          <div className={classes.row}>
            <span>City: </span>
            <span>{city}</span>
          </div>
          <div className={classes.row}>
            <span>State: </span>
            <span>{state}</span>
          </div>
          <div className={classes.row}>
            <span>Zip: </span>
            <span>{zip}</span>
          </div>

          <div className={classes.row}></div>
          <div className={classes.row}></div>

          <div className={classes.row}>
            <span>Card: </span>
            <span>**{cardNumber.slice(-4)}</span>
          </div>
          <div className={classes.row}>
            <span>Exp Date: </span>
            <span>{expDate}</span>
          </div>
        </div>
        <div className={classes.returnBtnBox}>
          <button
            className={classes.returnBtn}
            onClick={() => {
              setView("form");
              setGuestPayment(undefined);
            }}
          >
            Return to form
          </button>
        </div>
      </div>

      {/* FORM */}
      <div
        style={{ display: view === "form" ? "block" : "none" }}
        className={classes.mainForm}
      >
        <h2>Guest Checkout</h2>
        <div className={classes.form}>
          <h3>Payment</h3>
          <div className={classes.creditFormBox}>
            <CardNumberInput fontScale={0.95} onChange={setCardNumber} />
            <ExpDateInput
              fontScale={0.95}
              display="inline-block"
              onChange={setExpDate}
            />
            <CvvInput
              fontScale={0.95}
              display="inline-block"
              onChange={setCvv}
            />
          </div>
          <div className={classes.billToFormBox}>
            <BillToForm
              setFName={setFirstName}
              setLName={setLastName}
              setAddress={setAddress}
              setCity={setCity}
              setState={setState}
              setZip={setZip}
              setPhone={setUnusedPhone}
            />
          </div>
          {/* <TextInput
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
          /> */}
        </div>
        {errorMessage && <p style={{ color: "red" }}> {errorMessage}</p>}
        {/* <button onClick={sendForm}>Verify f2orm</button>
        <button
          className={classes.returnSignInBtn}
          onClick={() => setDisplayState("loggedOut")}
        >
          Back2
        </button> */}
        <div className={classes.btns}>
          <Button variant="contained" onClick={sendForm}>
            Add Payment
          </Button>
          <Button
            onClick={() => setDisplayState("loggedOut")}
            variant="outlined"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}

// checks form inputs, returns error message if applicable
function validateForm(data: GuestPayment): string {
  // first make sure billTo is filled in
  let errorToBe: string = "Please fill in all fields: ";
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
  let expDate = data.creditCard.expDate.split("/").join("");
  if (expDate.length < 4) {
    return "Invalid Expiration Date";
  }
  if (isNaN(expDate)) return "Only numbers are valid for 'Expiration Date'";
  const month: number = Number(expDate.slice(0, 2));
  const year: number = Number(expDate.slice(-2));
  if (month > 12) return "Invalid Expiration Month";

  if (!isInDate(expDate)) return "Card is out of date.";

  // check creditCard CVV
  let cvv = data.creditCard.cvv;
  if (cvv.length < 3) {
    return "Invalid CVV Length";
  }
  if (isNaN(cvv)) return "Only numbers are valid for 'CVV'";

  return "ok";
}

//util functions:
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
function isInDate(dateStr: string): boolean {
  // input date format: 'mmyy'
  const month = dateStr.slice(0, 2);
  const year = dateStr.slice(-2);

  const todaysDate = new Date();
  const inputDate = new Date(`${month}/01/20${year}`);

  return todaysDate < inputDate;
}

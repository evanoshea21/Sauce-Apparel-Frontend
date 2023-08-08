"use client";
import React from "react";
import TextInput from "../ui/TextInput";
import CreditInput from "../ui/CreditInput";

// interface Props {
//   setAddress: React.Dispatch<React.SetStateAction<string>>;
//   setCity: React.Dispatch<React.SetStateAction<string>>;
//   setState: React.Dispatch<React.SetStateAction<string>>;
//   setZip: React.Dispatch<React.SetStateAction<string>>;
//   setCountry: React.Dispatch<React.SetStateAction<string>>;
// }

export default function CreditCard(props: any) {
  const [CCN, setCCN] = React.useState<string>("");

  return (
    <div
      style={{
        border: "1px solid grey",
        borderRadius: "20px",
        padding: "20px",
        margin: "20px",
      }}
    >
      <h1>Credit Card Form</h1>
      <form>
        <CreditInput
          onChange={setCCN}
          label="Credit Card Number"
          placeholder="jsnckjsd"
        />
        <input
          type="tel"
          name="expiration date"
          maxLength={4}
          placeholder="MM / YY"
        />
        <input type="text" name="cvv" placeholder="CVV" />
      </form>
    </div>
  );
}

"use client";
import React from "react";
import TextInput from "../ui/TextInput";

interface Props {
  setCardNum: React.Dispatch<React.SetStateAction<string>>;
  setExpDate: React.Dispatch<React.SetStateAction<string>>;
  setCVV: React.Dispatch<React.SetStateAction<string>>;
}

export default function CreditCard(props: any) {
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
      <form></form>
    </div>
  );
}

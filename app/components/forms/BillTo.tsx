"use client";
import React from "react";
import TextInput from "../ui/TextInput";

interface Props {
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  setState: React.Dispatch<React.SetStateAction<string>>;
  setZip: React.Dispatch<React.SetStateAction<string>>;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
}

export default function BillTo(props: Props) {
  return (
    <div
      style={{
        border: "1px solid grey",
        borderRadius: "20px",
        padding: "20px",
        margin: "20px",
      }}
    >
      <h1>Bill To Form</h1>
      <form>
        <TextInput
          inputId="address-line1"
          placeholder="Address"
          onChange={props.setAddress}
          display="block"
        />
        <TextInput inputId="city" placeholder="City" onChange={props.setCity} />
        <TextInput
          inputId="state"
          placeholder="State"
          onChange={props.setState}
        />
        <TextInput inputId="Zip" placeholder="Zip" onChange={props.setZip} />
        <TextInput
          inputId="country"
          placeholder="Country"
          onChange={props.setCountry}
        />
      </form>
    </div>
  );
}

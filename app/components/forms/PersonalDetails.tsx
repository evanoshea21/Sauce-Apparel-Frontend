"use client";
import React from "react";
import TextInput from "../ui/TextInput";

interface Props {
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

export default function PersonalDetails(props: any) {
  return (
    <div
      style={{
        border: "1px solid grey",
        borderRadius: "20px",
        padding: "20px",
        margin: "20px",
      }}
    >
      <h1>Personal Details Form</h1>
      <form>
        <TextInput
          inputId="firstName"
          placeholder="First Name"
          onChange={props.setFirstName}
          display="block"
        />
        <TextInput
          inputId="lastName"
          placeholder="Last Name"
          onChange={props.setLastName}
          display="block"
        />
        <TextInput
          inputId="phone"
          placeholder="Phone"
          onChange={props.setPhone}
          display="block"
        />
        <TextInput
          inputId="firstName"
          placeholder="Email"
          onChange={props.setEmail}
          display="block"
        />
      </form>
    </div>
  );
}

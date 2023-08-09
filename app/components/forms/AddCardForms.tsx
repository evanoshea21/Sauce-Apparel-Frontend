"use client";
import React from "react";
import TextInput from "../ui/TextInput";
import CreditInput from "../ui/CreditInput";
import ExpDateInput from "../ui/ExpDateInput";
import CvvInput from "../ui/CvvInput";
import Button from "@mui/material/Button";

interface CreditCardProps {
  setFName: React.Dispatch<React.SetStateAction<string>>;
  setLName: React.Dispatch<React.SetStateAction<string>>;
  setCCN: React.Dispatch<React.SetStateAction<string>>;
  setExpDate: React.Dispatch<React.SetStateAction<string>>;
}
interface BillToProps {
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  setState: React.Dispatch<React.SetStateAction<string>>;
  setZip: React.Dispatch<React.SetStateAction<string>>;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
}

export function CreditCardForm(props: CreditCardProps) {
  // const [fName, setFName] = React.useState<string>("");
  // const [lName, setLName] = React.useState<string>("");
  // const [CCN, setCCN] = React.useState<string>("");
  // const [expDate, setExpDate] = React.useState<string>("");

  return (
    <div>
      <h1>Payment</h1>
      <form
        style={{
          // border: "1px solid red",
          width: "430px",
          height: "160px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            fontScale={1}
            inputId="billTo-first-name"
            placeholder="First Name"
            onChange={props.setFName}
            display="inline-block"
            widthScale={0.8}
          />
          <TextInput
            fontScale={1}
            inputId="billTo-last-name"
            placeholder="Last Name"
            onChange={props.setLName}
            display="inline-block"
            widthScale={0.94}
            // styles={{ marginLeft: "2.9em" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <CreditInput
              fontScale={1}
              onChange={props.setCCN}
              display="inline-block"
            />
          </div>
          <div>
            <ExpDateInput
              fontScale={1}
              onChange={props.setExpDate}
              display="inline-block"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export function BillToForm(props: BillToProps) {
  // const [address, setAddress] = React.useState<string>("");
  // const [city, setCity] = React.useState<string>("");
  // const [state, setState] = React.useState<string>("");
  // const [zip, setZip] = React.useState<string>("");
  // const [country] = React.useState<string>("USA");
  // const [phone, setPhone] = React.useState<string>("");

  return (
    <div>
      <h1>Address</h1>
      <form
        style={{
          // border: "1px solid red",
          width: "430px",
          height: "145px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <TextInput
            fontScale={1}
            inputId="billTo-address"
            placeholder="Street Address"
            onChange={props.setAddress}
            display="block"
            widthScale={1.1}
          />
          <TextInput
            fontScale={1}
            inputId="billTo-city"
            placeholder="City"
            onChange={props.setCity}
            display="block"
            widthScale={0.7}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <TextInput
            fontScale={1}
            inputId="billTo-state"
            placeholder="State"
            onChange={props.setState}
            display="block"
            widthScale={0.25}
            maxLength={2}
          />
          <TextInput
            fontScale={1}
            inputId="billTo-zip"
            placeholder="Zip"
            onChange={props.setZip}
            display="block"
            widthScale={0.35}
            maxLength={5}
          />
          <TextInput
            fontScale={1}
            inputId="billTo-phone"
            placeholder="Phone"
            onChange={props.setPhone}
            display="block"
            widthScale={0.95}
            maxLength={10}
          />
        </div>
      </form>
    </div>
  );
}

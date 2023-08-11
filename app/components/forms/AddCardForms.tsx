"use client";
import React from "react";
import TextInput from "../ui/TextInput";
import CreditInput from "../ui/CreditInput";
import ExpDateInput from "../ui/ExpDateInput";
import CvvInput from "../ui/CvvInput";
import Button from "@mui/material/Button";

interface CreditCardProps {
  setCCN: React.Dispatch<React.SetStateAction<string>>;
  setExpDate: React.Dispatch<React.SetStateAction<string>>;
}
interface BillToProps {
  setFName: React.Dispatch<React.SetStateAction<string>>;
  setLName: React.Dispatch<React.SetStateAction<string>>;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  setState: React.Dispatch<React.SetStateAction<string>>;
  setZip: React.Dispatch<React.SetStateAction<string>>;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  defaultValues?: Address;
}

export function CreditCardForm(props: CreditCardProps) {
  return (
    <div>
      <h3 style={{ marginLeft: "8px" }}>Add Payment</h3>
      <form
        style={{
          // border: "1px solid red",
          maxWidth: "390px",
          // height: "140px",
          display: "flex",
          flexWrap: "wrap",
          // flexDirection: "column",
          // justifyContent: "space-between",
        }}
      >
        {/* <div style={{ display: "flex", justifyContent: "space-between" }}> */}
        <div
          style={{
            // border: "1px solid green",
            paddingRight: "10px",
            paddingBottom: "20px",
          }}
        >
          <CreditInput
            fontScale={0.9}
            onChange={props.setCCN}
            display="inline-block"
          />
        </div>
        <div
          style={
            {
              // border: "1px solid blue",
              // paddingLeft: "10px",
            }
          }
        >
          <ExpDateInput
            fontScale={0.9}
            onChange={props.setExpDate}
            display="inline-block"
          />
        </div>
        {/* </div> */}
      </form>
    </div>
  );
}

export function BillToForm(props: BillToProps) {
  return (
    <div>
      <h3 style={{ marginLeft: "8px" }}>Billing Details</h3>
      <form
        style={{
          // border: "1px solid red",
          maxWidth: "390px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <TextInput
            fontScale={0.9}
            inputId="billTo-first-name"
            placeholder="First Name"
            onChange={props.setFName}
            display="inline-block"
            widthScale={0.8}
          />
          <TextInput
            fontScale={0.9}
            inputId="billTo-last-name"
            placeholder="Last Name"
            onChange={props.setLName}
            display="inline-block"
            widthScale={0.94}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <TextInput
            defaultValue={props.defaultValues?.address ?? ""}
            fontScale={0.9}
            inputId="billTo-address"
            placeholder="Street Address"
            onChange={props.setAddress}
            display="block"
            widthScale={1.05}
          />
          <TextInput
            defaultValue={props.defaultValues?.city ?? ""}
            fontScale={0.9}
            inputId="billTo-city"
            placeholder="City"
            onChange={props.setCity}
            display="block"
            widthScale={0.7}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <TextInput
            defaultValue={props.defaultValues?.state ?? ""}
            fontScale={0.9}
            inputId="billTo-state"
            placeholder="State"
            onChange={props.setState}
            display="block"
            widthScale={0.25}
            maxLength={2}
          />
          <TextInput
            defaultValue={props.defaultValues?.zip ?? ""}
            fontScale={0.9}
            inputId="billTo-zip"
            placeholder="Zip"
            onChange={props.setZip}
            display="block"
            widthScale={0.35}
            maxLength={5}
          />
          <TextInput
            defaultValue={props.defaultValues?.phone ?? ""}
            fontScale={0.9}
            inputId="billTo-phone"
            placeholder="Phone"
            onChange={props.setPhone}
            display="block"
            widthScale={0.9}
            maxLength={10}
          />
        </div>
      </form>
    </div>
  );
}

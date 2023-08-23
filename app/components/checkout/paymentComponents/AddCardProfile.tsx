"use client";
import React from "react";
import axios from "axios";
import { returnDateStr, toSdkExpDate } from "@/app/utils";
import type { Address, AddCardData, CustomerProfile } from "@/scripts/Types";
import type { DisplayStates } from "../Payment";
import { CreditCardForm, BillToForm } from "../../forms/AddCardForms";
import Button from "@mui/material/Button";

interface AddCardRequest {
  url: string;
  method: "POST";
  data: AddCardData;
}
interface CreateProfilePayload {
  creditCard: {
    card_number: string;
    expDate: string;
  };
  billTo: Address;
  merchantCustomerId: string; // phone
  description?: string; // profile created on website
  email: string; // from session
}

interface AddCardProfileProps {
  existingCustomerProfile?: CustomerProfile;
  setRefetchAllCustomer: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshCustomer: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplayState: React.Dispatch<React.SetStateAction<DisplayStates>>;
  session: any;
}
export default function AddCardProfile({
  existingCustomerProfile,
  setRefetchAllCustomer,
  setRefreshCustomer,
  setDisplayState,
  session,
}: AddCardProfileProps) {
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  // holds state for forms. Adds card / Creates customer profile
  const [card_number, setCreditCardNum] = React.useState<string>("");
  const [expDate, setExpDate] = React.useState<string>("");
  // address
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [state, setState] = React.useState<string>("");
  const [zip, setZipCode] = React.useState<string>("");
  // more details
  const [phone, setPhone] = React.useState<string>("");

  function allFieldsAreFilled(): boolean {
    // go through all

    if (
      card_number.length === 0 ||
      expDate.length === 0 ||
      firstName.length === 0 ||
      lastName.length === 0 ||
      address.length === 0 ||
      city.length === 0 ||
      state.length === 0 ||
      zip.length === 0 ||
      phone.length === 0
    ) {
      setErrorMessage("Please fill in all fields.");
      return false;
    }

    return true;
  }

  function addCardProfile() {
    if (!allFieldsAreFilled()) return;
    // if existing profile, ADD card to it
    setDisplayState("loadingCP");
    if (existingCustomerProfile) {
      let addCardReqConfig: AddCardRequest = {
        url: `${process.env.NEXT_PUBLIC_SDK_SERVER_BASE_URL}/addCard`,
        method: "POST",
        data: {
          customerProfileId: existingCustomerProfile.customerProfileId,
          cardNumber: card_number,
          expDate: toSdkExpDate(expDate),
          billTo: {
            firstName,
            lastName,
            address,
            city,
            state,
            zip,
            country: "USA",
            phone,
          },
        },
      };
      axios(addCardReqConfig)
        .then((res) => {
          console.log("Success Added Card Response: ", res.data);
          // get profile again for parent to go back to CHOOSE card
          setRefreshCustomer((prev) => !prev);
        })
        .catch((e) => {
          console.error(
            "error adding card: ",
            e.response.data.messages.message[0]
          );
        });
    } else if (session) {
      // if not, CREATE customer profile with card
      const formData: CreateProfilePayload = {
        creditCard: {
          card_number,
          expDate,
        },
        billTo: {
          firstName,
          lastName,
          address,
          city,
          state,
          zip,
          country: "USA",
          phone,
        },
        merchantCustomerId: `${lastName},${firstName}`,
        description: `member since ${returnDateStr()}`,
        email: session?.user.email ?? "no email provided",
      };
      // send form data to SDK create profile
      axios({
        url: `${process.env.NEXT_PUBLIC_SDK_SERVER_BASE_URL}/createprofile`,
        method: "POST",
        data: formData,
      })
        .then((res) => {
          const custProfileId: string = res.data.customerProfileId;
          // then, save CustomerProfile to User Account
          axios({
            url: "/api/save-customer-profile",
            method: "POST",
            data: {
              userId: session.user.id,
              customerProfileId: custProfileId,
              firstName,
              lastName,
              email: session.user.email,
              phone,
            },
          })
            .then((res) => {
              // now it's saved and created, reFETCH time
              setRefetchAllCustomer((prev) => !prev);
            })
            .catch((e) => {
              console.error("error saving profile to DB");
              setDisplayState("networkError");
            });
        })
        .catch((e) => {
          const error = e.response.data.messages.message[0];
          console.log("ERROR creating profile:\n ", error);
          if (["E00027", "E00013"].includes(error.code)) {
            // invalid card
            setDisplayState("invalidCard");
          } else {
            setDisplayState("networkError");
          }
        });
    }
  }

  return (
    <>
      <div
        style={{
          // border: "1px solid red",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CreditCardForm setCCN={setCreditCardNum} setExpDate={setExpDate} />
      </div>
      <div
        style={{
          // border: "1px solid red",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <BillToForm
          setFName={setFirstName}
          setLName={setLastName}
          setAddress={setAddress}
          setCity={setCity}
          setZip={setZipCode}
          setState={setState}
          setPhone={setPhone}
        />
      </div>
      <div
        style={{
          color: "red",
          textAlign: "center",
          maxWidth: "320px",
          margin: "20px auto 0 auto",
        }}
      >
        {errorMessage}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Button variant="contained" onClick={addCardProfile}>
          Add Payment
        </Button>
        <Button
          sx={{ ml: 2 }}
          variant="outlined"
          onClick={() => setDisplayState("chooseCard")}
        >
          Cancel
        </Button>
      </div>
    </>
  );
}

"use client";
import React from "react";
import axios from "axios";
import { returnDateStr } from "@/app/utils";
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
  setChosenPaymentId: React.Dispatch<React.SetStateAction<string>>;
  session: any;
}
export default function AddCardProfile({
  existingCustomerProfile,
  setRefetchAllCustomer,
  setRefreshCustomer,
  setDisplayState,
  setChosenPaymentId,
  session,
}: AddCardProfileProps) {
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

  function addCardProfile() {
    // if existing profile, ADD card to it
    if (existingCustomerProfile) {
      let addCardReqConfig: AddCardRequest = {
        url: "http://localhost:1400/addCard",
        method: "POST",
        data: {
          customerProfileId: existingCustomerProfile.customerProfileId,
          cardNumber: card_number,
          expDate,
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
          //set added card to new card
          setChosenPaymentId(res.data.customerPaymentProfileId);
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
        url: "http://localhost:1400/createprofile",
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
          console.log(
            "ERROR creating profile:\n ",
            e.response.data.messages.message[0]
          );
          setDisplayState("networkError");
        });
    }
  }

  return (
    <>
      <CreditCardForm
        setFName={setFirstName}
        setLName={setLastName}
        setCCN={setCreditCardNum}
        setExpDate={setExpDate}
      />
      <BillToForm
        setAddress={setAddress}
        setCity={setCity}
        setZip={setZipCode}
        setState={setState}
        setPhone={setPhone}
        defaultValues={existingCustomerProfile?.paymentProfiles[0].billTo}
      />
      <Button variant="contained" onClick={addCardProfile}>
        Add Payment Option
      </Button>
      <Button variant="outlined" onClick={() => setDisplayState("chooseCard")}>
        Back to Payment
      </Button>
    </>
  );
}
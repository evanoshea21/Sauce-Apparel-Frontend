"use client";
import React from "react";
import axios from "axios";
// import classes from "@/styles/Checkout.module.css";
import { useSession } from "next-auth/react";

interface CreateProfilePayload {
  creditCard: {
    card_number: string;
    expDate: string;
  };
  billTo: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    phone: string;
  };
  merchantCustomerId: string;
  description?: string;
  email: string;
}

/*
Sole purpose: [Show CustomerProfile or Form] & [send CustomerId/PaymentId up via props]
FLOW
- Check if User Logged in
  -Y: Check if User has CustomerProfile
    -Y: [done] Show their cards
    -N: [done]Show form to fill out
  -[done]N: Don't show Profile Section until User Logged in

  STATES
  - Logged out (authenticated, DONE)
  - Logged in, no CustomerProfile yet
  - Logged in, CustomerProfile
  - Logged in, CustomerProfileDNE

- Pass profileId and paymentProfileId up to Props

CLEAN

Left to do:
- error handling for "create profile", "save to personal DB", "get profile"
  - create profile (issue creating means try again, open up form)
  - issue saving to db means try again, open up form
  - issue getting after creation successful means network issue.

  - add card to profile
  - delete my customer profile [DONE], but also delete row with this customerId
*/
interface Props {
  setPaymentProfileId: React.Dispatch<React.SetStateAction<string>>;
  setCustomerProfileId: React.Dispatch<React.SetStateAction<string>>;
  customerProfileId: string;
}
interface CustomerProfile {
  customerProfileId: string;
  description: string;
  email: string;
  merchantCustomerId: string;
  paymentProfiles: PaymentProfile[];
  profileType: string;
}
interface PaymentProfile {
  billTo: {}[];
  customerPaymentProfileId: string;
  customerType: string;
  payment: { creditCard: { cardNumber: string } };
}
type DisplayStates =
  | "loggedOut"
  | "loadingCP"
  | "foundCP"
  | "noCP"
  | "networkError";

export default function CustomerProfile({
  setPaymentProfileId,
  setCustomerProfileId,
  customerProfileId,
}: Props) {
  //session updates on refresh
  const { data: session, status } = useSession();
  // local state for Payment Cards
  const [customerProfile, setCustomerProfile] =
    React.useState<CustomerProfile>();
  const [displayState, setDisplayState] =
    React.useState<DisplayStates>("loggedOut");
  // SELECT CREDIT CARD
  const [chosenCardId, setChosenCard] = React.useState<string>();
  // Form fields (state)
  // card
  const [card_number, setCreditCardNum] = React.useState<string>("");
  const [expDate, setExpDate] = React.useState<string>("");
  const [cvv, setCvv] = React.useState<string>("");
  // address
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [state, setState] = React.useState<string>("");
  const [zip_code, setZipCode] = React.useState<string>("");
  const [country, setCountry] = React.useState<string>("");
  // more details
  const [phone, setPhone] = React.useState<string>("");
  const [merchantCustomerId, setMerchantCustomerId] =
    React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");

  // GET [CP-id] AFTER LOG IN, or set to [noCP] or [networkError]
  React.useEffect(() => {
    // this running everytime you leave TAB. how to change this? ... thinking
    if (status === "authenticated") {
      console.log("running api..");
      setDisplayState("loadingCP");
      axios({
        url: "/api/get-profile-by-userid",
        method: "POST",
        data: { userId: session.user.id },
      })
        .then((res) => {
          setCustomerProfileId(res.data.customerProfileId);
        })
        .catch((e) => {
          //2 types of errors: DNE(accounted for), or Network Error
          if (e.response.data === "user DNE") {
            setDisplayState("noCP");
          } else {
            setDisplayState("networkError");
          }
        });
    }
  }, [status]);

  // get CustomerProfile from ID
  React.useEffect(() => {
    if (customerProfileId) {
      axios({
        url: "http://localhost:1400/getprofile",
        method: "POST",
        data: { id: customerProfileId },
      })
        .then((res) => {
          // set profile for access to cards (and other data)
          setCustomerProfile(res.data.profile);
          // set chosen card to First
          setChosenCard(
            res.data.profile.paymentProfiles[0].customerPaymentProfileId
          );
        })
        .catch((e) => {
          // 2 possible errors, profile DNE, or network error
          if (e.response.data === "user DNE") {
            setDisplayState("noCP");
          } else {
            setDisplayState("networkError");
          }
          console.error("issue getting profile..", e);
        });
    }
  }, [customerProfileId]);

  React.useEffect(() => {
    if (customerProfile) {
      setDisplayState("foundCP");
    }
  }, [customerProfile]);

  // choose card
  React.useEffect(() => {
    setPaymentProfileId(chosenCardId || "");
    console.log(
      "chosen card: ",
      chosenCardId,
      "customerProfileId: ",
      customerProfileId
    );
  }, [chosenCardId]);

  function handleForm(e: any) {
    e.preventDefault();
    setDisplayState("loadingCP");
    if (!session) return;

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
        zip_code,
        country,
        phone,
      },
      merchantCustomerId,
      description,
      email: session?.user.email ?? "no email provided",
    };

    // send form data to SDK create profile
    axios({
      url: "http://localhost:1400/createprofile",
      method: "POST",
      data: formData,
    })
      .then((res) => {
        const custProfileId = res.data.customerProfileId;
        // then, save CustomerProfile to User Account
        axios({
          url: "/api/save-customer-profile",
          method: "POST",
          data: { userId: session.user.id, customerProfileId: custProfileId },
        })
          .then((res) => {
            setCustomerProfileId(custProfileId);
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
  } // handle form

  function deleteProfile() {
    axios({
      url: "http://localhost:1400/deleteprofile",
      method: "DELETE",
      data: { customerId: customerProfileId },
    })
      .then((res) => {
        console.log("deleted?: ", res.data);
        // set display
        setDisplayState("noCP");

        // delete from saved table (cascade)
        axios({
          url: "/api/save-customer-profile",
          method: "DELETE",
          data: { customerProfileId },
        })
          .then((res) => {
            setCustomerProfileId("");
          })
          .catch((e) => {
            console.error("error deleting saved profile from personal DB");
          });
      })
      .catch((e) => {
        console.error("error deleting: ", e);
      });
  }

  interface Address {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  }
  interface AddCardData {
    customerProfileId: string;
    cardNumber: string;
    expDate: string;
    billTo: Address;
  }

  interface AddCardRequest {
    url: string;
    method: "POST";
    data: AddCardData;
  }

  function addCard() {
    let cardNum = "4539830555056060";
    let expDate = "0925";
    let fName = "Brother";
    let lName = "Oshay";

    let addCardReqConfig: AddCardRequest = {
      url: "http://localhost:1400/addCard",
      method: "POST",
      data: {
        customerProfileId: customerProfileId,
        cardNumber: cardNum,
        expDate: expDate,
        billTo: {
          firstName: fName,
          lastName: lName,
          address: "123 main lane",
          city: "bothell",
          state: "WA",
          zip: "98208",
          country: "USA",
          phone: "9165559344",
        },
      },
    };
    axios(addCardReqConfig)
      .then((res) => {
        console.log("added Card Response: ", res.data);
        setChosenCard(res.data.customerPaymentProfileId);
        // get profile again
        console.log(
          "updating profile state... retrieving new payments on file.."
        );
        axios({
          url: "http://localhost:1400/getprofile",
          method: "POST",
          data: { id: customerProfileId },
        })
          .then((res) => {
            console.log("GET customer profile after creation: ", res.data);

            setCustomerProfile(res.data.profile);
          })
          .catch((e) => {
            console.log("error getting profile");
            setDisplayState("networkError");
          });
      })
      .catch((e) => {
        console.error(
          "error adding card: ",
          e.response.data.messages.message[0]
        );
      });
  }

  if (displayState === "loggedOut") {
    return <>Not Logged In</>;
  }
  if (displayState === "loadingCP") {
    return <>Loading Customer Profile</>;
  }
  if (displayState === "networkError") {
    return <>Network Error: Couldn't retrieve your profile. Try again later.</>;
  }

  if (displayState === "noCP") {
    return (
      <div>
        <h3>Customer Profile DNE. Time to make one:</h3>
        <form onSubmit={handleForm}>
          {/* CREDIT CARD */}
          <input
            required
            placeholder="credit card number"
            onChange={(e) => setCreditCardNum(e.target.value)}
          />
          <input
            required
            placeholder="exp date"
            onChange={(e) => setExpDate(e.target.value)}
          />
          <input
            required
            placeholder="CVV"
            onChange={(e) => setCvv(e.target.value)}
          />
          {/* ADDRESS */}
          <input
            required
            placeholder="first name"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            required
            placeholder="last name"
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            required
            placeholder="address"
            onChange={(e) => setAddress(e.target.value)}
          />
          <input placeholder="city" onChange={(e) => setCity(e.target.value)} />
          <input
            required
            placeholder="state"
            onChange={(e) => setState(e.target.value)}
          />
          <input
            required
            placeholder="zip code"
            onChange={(e) => setZipCode(e.target.value)}
          />
          <input
            required
            placeholder="country"
            onChange={(e) => setCountry(e.target.value)}
          />
          <input
            required
            placeholder="phone"
            onChange={(e) => setPhone(e.target.value)}
          />
          {/* USER PROFILE DETAILS */}
          <input
            required
            placeholder="merchant customers id (prob not in form in future)"
            onChange={(e) => setMerchantCustomerId(e.target.value)}
          />
          <input
            required
            placeholder="description (of customer?)"
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
  // else if (displayState === 'foundCP')
  return (
    <div>
      <h1>Customer Profile Info:</h1>
      <button onClick={() => deleteProfile()}>DELETE MY PROFILE</button>
      {/* instead of stringifying it, you should display a card for every payment
      option */}
      {customerProfile && Array.isArray(customerProfile.paymentProfiles) && (
        <>
          {customerProfile.paymentProfiles.map((card, i) => {
            return (
              <div
                onClick={() => setChosenCard(card.customerPaymentProfileId)}
                style={{
                  backgroundColor:
                    card.customerPaymentProfileId === chosenCardId
                      ? "pink"
                      : "white",
                }}
                key={i}
              >
                {card.payment.creditCard.cardNumber}
              </div>
            );
          })}
        </>
      )}
      <button onClick={() => addCard()}>Add Card</button>
    </div>
  );
}

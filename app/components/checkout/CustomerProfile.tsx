"use client";
import React from "react";
import axios from "axios";
// import classes from "@/styles/Checkout.module.css";
import { useSession } from "next-auth/react";

interface Props {
  userId: string;
}

export default function CustomerProfile() {
  const { data: session } = useSession();
  const [customerProfileId, setCustomerProfileId] = React.useState<string>();
  const [customerProfile, setCustomerProfile] = React.useState();
  const [errorMessage, setErrorMessage] = React.useState<string>();
  // Form fields (state)
  const [card_number, setCreditCardNum] = React.useState<string>();
  const [expDate, setExpDate] = React.useState<string>();

  const [firstName, setFirstName] = React.useState<string>();
  const [lastName, setLastName] = React.useState<string>();
  const [address, setAddress] = React.useState<string>();
  const [city, setCity] = React.useState<string>();
  const [state, setState] = React.useState<string>();
  const [zip_code, setZipCode] = React.useState<string>();
  const [country, setCountry] = React.useState<string>();
  const [phone, setPhone] = React.useState<string>();
  const [merchantCustomerId, setMerchantCustomerId] = React.useState<string>();
  const [description, setDescription] = React.useState<string>();
  const [email, setEmail] = React.useState<string>();

  React.useEffect(() => {
    // GOAL: set customer profile if exists from Oauth account
    if (session) {
      axios({
        url: "/api/get-profile-by-userid",
        method: "POST",
        data: { userId: session.user.id },
      }).then((res) =>
        // console.log("axios get-user-by-id response: ", res.data);
        setCustomerProfileId(res.data.customerProfileId)
      );
    }
  }, [session]);

  React.useEffect(() => {
    if (customerProfileId) {
      axios({
        url: "http://localhost:1400/getprofile",
        method: "POST",
        data: { id: customerProfileId },
      })
        .then((res) => {
          console.log("Customer Profile Recieved: ", res.data.profile);
          setCustomerProfile(res.data.profile);
        })
        .catch((e) => console.error("issue getting profile..", e));
    }
  }, [customerProfileId]);

  function handleForm(e: any) {
    e.preventDefault();
    const formData = {
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
      email,
    };

    // send form data to SDK create profile
    axios({
      url: "http://localhost:1400/createprofile",
      method: "POST",
      data: formData,
    })
      .then((res) => {
        console.log("created profile axios?", res.data);
        const { customerProfileId } = res.data;
        // send this to endpoint where you prisma.customerProfile.create({userid, customerProfileId});
        axios({
          url: "/api/save-customer-profile",
          method: "POST",
          data: { userId: session?.user.id, customerProfileId },
        }).then((res) => console.log("response saving profile?", res.data));

        //get customerProfileById, via SDK
        axios({
          url: "http://localhost:1400/getprofile",
          method: "POST",
          data: { id: customerProfileId },
        }).then((res) => {
          console.log("GET customer profile after creation: ", res.data);

          setCustomerProfile(res.data);
        });
      })
      .catch((e) => {
        console.log("ERROR:\n ", e.response.data.messages.message[0]);
        setErrorMessage(JSON.stringify(e.response.data.messages.message[0]));
      });

    // console.log("form data CIM: \n", formData);
  }

  if (!session) {
    return <>loading or unauthenticated..</>;
  }

  if (!customerProfile && session) {
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
          <input
            required
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">Submit</button>
        </form>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div>
      <h1>Customer Profile Info:</h1>
      {/* instead of stringifying it, you should display a card for every payment
      option */}
      {customerProfile.paymentProfiles && (
        <>
          {customerProfile.paymentProfiles.map((card, i) => {
            return <div key={i}>{card.payment.creditCard.cardNumber}</div>;
          })}
        </>
      )}
      {/* <p>{JSON.stringify(customerProfile)}</p> */}
    </div>
  );
}

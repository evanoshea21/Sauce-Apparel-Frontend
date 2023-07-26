"use client";
/*

Purpose of this component:
- purely to test all the SDK enpoints, like createProfile, chargeProfile, getProfile

*/
import axios from "axios";
import React from "react";

export default function TransactionButton() {
  function createProfile() {
    axios({
      url: "http://localhost:1400/createProfile",
      method: "GET",
    }).then((res) => {
      console.log("response from getProfile:\n ", res.data);
    });
  }

  function getProfile() {
    axios({
      url: "http://localhost:1400/getprofile",
      method: "GET",
    }).then((res) => {
      console.log("response from getProfile:\n ", res.data);
    });
  }

  function getPaymentProfile() {
    axios({
      url: "http://localhost:1400/getpaymentprofile",
      method: "GET",
    }).then((res) => {
      console.log("response from getPaymentProfile:\n ", res.data);
    });
  }
  function chargePaymentProfile() {
    axios({
      url: "http://localhost:1400/chargeProfile",
      method: "GET",
    }).then((res) => {
      console.log("response from chargeProfile:\n ", res.data);
    });
  }
  function addCardToProfile() {
    axios({
      url: "http://localhost:1400/addCard",
      method: "GET",
    }).then((res) => {
      console.log("response from addCard:\n ", res.data);
    });
  }
  return (
    <div>
      <button onClick={createProfile}>CREATE Profile</button>
      <button onClick={getProfile}>Get Profile</button>
      <button onClick={getPaymentProfile}>Get Payment Profile</button>
      <button onClick={chargePaymentProfile}>Charge Profile $1</button>
      <button onClick={addCardToProfile}>Add Card to profile</button>
    </div>
  );
}

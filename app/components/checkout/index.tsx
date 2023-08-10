"use client";
import React from "react";

import type { CartItem } from "@/scripts/Types";

import Cart from "./Cart";
import Payment from "./Payment";
import CheckoutBtn from "./CheckoutBox";
import PersonalDetails from "../forms/PersonalDetails";
import { signOut } from "next-auth/react";

export default function CheckoutPage() {
  const [customerProfileId, setCustomerProfileId] = React.useState<string>("");
  const [paymentProfileId, setPaymentProfileId] = React.useState<string>("");

  return (
    <div>
      <button onClick={() => signOut()}>Log out</button>
      {/* CART ITEMS HERE */}
      <Cart />
      {/* GET PAYMENT */}
      <Payment
        customerProfileId={customerProfileId}
        setCustomerProfileId={setCustomerProfileId}
        setPaymentProfileId={setPaymentProfileId}
      />
      {/* COMPLETE CHECKOUT BUTTON HERE */}
      <CheckoutBtn
        customerProfileId={customerProfileId}
        paymentProfileId={paymentProfileId}
      />
    </div>
  );
}

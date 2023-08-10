"use client";
import React from "react";

import type { CartItem } from "@/scripts/Types";

import Cart from "./Cart";
import Login from "./ARCHIVELogin";
import Payment from "./Payment";
import CheckoutBtn from "./CheckoutBtn";
import PersonalDetails from "../forms/PersonalDetails";

export default function CheckoutPage() {
  const [customerProfileId, setCustomerProfileId] = React.useState<string>("");
  const [paymentProfileId, setPaymentProfileId] = React.useState<string>("");

  return (
    <div>
      {/* CART ITEMS HERE */}
      <Cart />
      {/* GET PAYMENT */}
      <Payment
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

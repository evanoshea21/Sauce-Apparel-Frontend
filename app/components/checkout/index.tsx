"use client";
import React from "react";

import type { CartItem } from "@/scripts/Types";

import Cart from "./Cart";
import Login from "./Login";
import CustomerProfile from "./CustomerProfile";
import CheckoutBtn from "./CheckoutBtn";
import PersonalDetails from "../forms/PersonalDetails";
import { CreditCardForm, BillToForm } from "../forms/AddCardForms";

export default function CheckoutPage() {
  const [customerProfileId, setCustomerProfileId] = React.useState<string>("");
  const [paymentProfileId, setPaymentProfileId] = React.useState<string>("");

  return (
    <div>
      {/* CART ITEMS HERE */}
      <Cart />
      {/* LOGIN COMPONENT HERE */}
      <Login />
      {/* DISPLAY USER CIM INFO HERE */}
      <CustomerProfile
        setPaymentProfileId={setPaymentProfileId}
        setCustomerProfileId={setCustomerProfileId}
        customerProfileId={customerProfileId}
      />
      {/* COMPLETE CHECKOUT BUTTON HERE */}
      <CheckoutBtn
        customerProfileId={customerProfileId}
        paymentProfileId={paymentProfileId}
      />
    </div>
  );
}

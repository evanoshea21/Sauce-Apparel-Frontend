"use client";
import React from "react";

import Cart from "./Cart";
import Login from "./Login";
import CustomerProfile from "./CustomerProfile";
import CheckoutBtn from "./CheckoutBtn";

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
        setProfileId={setCustomerProfileId}
      />
      {/* COMPLETE CHECKOUT BUTTON HERE */}
      <CheckoutBtn
        customerProfileId={customerProfileId}
        paymentProfileId={paymentProfileId}
      />
    </div>
  );
}

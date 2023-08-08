"use client";
import React from "react";

import type { CartItem } from "@/scripts/Types";

import Cart from "./Cart";
import Login from "./Login";
import CustomerProfile from "./CustomerProfile";
import CheckoutBtn from "./CheckoutBtn";
import BillTo from "../forms/BillTo";
import PersonalDetails from "../forms/PersonalDetails";
import CreditCard from "../forms/CreditCard";

export default function CheckoutPage() {
  const [customerProfileId, setCustomerProfileId] = React.useState<string>("");
  const [paymentProfileId, setPaymentProfileId] = React.useState<string>("");
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);

  return <CreditCard />;

  return (
    <div>
      {/* CART ITEMS HERE */}
      <Cart cartItems={cartItems} setCartItems={setCartItems} />
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
        cartItems={cartItems}
      />
    </div>
  );
}

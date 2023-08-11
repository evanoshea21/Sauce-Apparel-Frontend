"use client";
import React from "react";
import Cart from "./Cart";
import Payment from "./Payment";
import CheckoutBtn from "./CheckoutBox";
import { signOut } from "next-auth/react";

export default function CheckoutPage() {
  const [customerProfileId, setCustomerProfileId] = React.useState<string>("");
  const [paymentProfileId, setPaymentProfileId] = React.useState<string>("");
  const [refreshCart, setRefreshCart] = React.useState<boolean>(false);

  return (
    <div>
      <button onClick={() => signOut()}>Log out</button>
      {/* CART ITEMS HERE */}
      <Cart setRefreshCart={setRefreshCart} />
      {/* GET PAYMENT */}
      <Payment
        customerProfileId={customerProfileId}
        setCustomerProfileId={setCustomerProfileId}
        setPaymentProfileId={setPaymentProfileId}
      />
      {/* COMPLETE CHECKOUT BUTTON HERE */}
      <CheckoutBtn
        refreshCart={refreshCart}
        customerProfileId={customerProfileId}
        paymentProfileId={paymentProfileId}
      />
    </div>
  );
}

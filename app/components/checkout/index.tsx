"use client";
import React from "react";
import classes from "@/styles/Checkout.module.css";
import Cart from "./Cart";
import Payment from "./Payment";
import CheckoutBox from "./CheckoutBox";
import { signOut } from "next-auth/react";
import type { InvIssues } from "./CheckoutBox";

export interface Payment {
  paymentProfileId: string;
  cardNumber: string;
  cardType: string;
}

export default function CheckoutPage() {
  const [customerProfileId, setCustomerProfileId] = React.useState<string>("");
  const [payment, setPayment] = React.useState<Payment | undefined>();
  const [refreshCart, setRefreshCart] = React.useState<boolean>(false);
  const [invIssues, setInvIssues] = React.useState<InvIssues[] | undefined>();

  return (
    <>
      <div className={classes.checkoutFlex}>
        <div
          style={{
            flex: "2 ",
          }}
        >
          <Cart setRefreshCart={setRefreshCart} invIssues={invIssues} />
          <Payment
            customerProfileId={customerProfileId}
            setCustomerProfileId={setCustomerProfileId}
            setPayment={setPayment}
          />
          <div className={classes.gap}></div>
        </div>
        {/* COMPLETE CHECKOUT BUTTON HERE */}
        <div
          style={{
            flex: "1 ",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <CheckoutBox
            refreshCart={refreshCart}
            customerProfileId={customerProfileId}
            payment={payment}
            setInvIssues={setInvIssues}
          />
        </div>
      </div>
      <button onClick={() => signOut()}>Log out</button>
    </>
  );
}

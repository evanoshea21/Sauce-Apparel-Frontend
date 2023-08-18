"use client";
import React from "react";
import classes from "@/styles/Checkout.module.css";
import Cart from "./Cart";
import Payment from "./Payment";
import CheckoutBox from "./CheckoutBox";
import { signOut } from "next-auth/react";
import type { InvIssues } from "./CheckoutBox";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { GuestPayment } from "./paymentComponents/GuestCard";
import { getCartItems } from "@/app/utils";

export interface Payment {
  paymentProfileId: string;
  cardNumber: string;
  cardType: string;
  expDate: string;
}

export type Screens =
  | "loading"
  | "sending purchase"
  | ["successful transaction", string]
  | undefined;

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const [customerProfileId, setCustomerProfileId] = React.useState<string>("");
  const [payment, setPayment] = React.useState<Payment | undefined>();
  const [guestPayment, setGuestPayment] = React.useState<
    GuestPayment | undefined
  >();
  const [refreshCart, setRefreshCart] = React.useState<boolean>(false);
  const [invIssues, setInvIssues] = React.useState<InvIssues[] | undefined>();
  const [cartIsDefined, setCartIsDefined] = React.useState<boolean>(false);
  const [screen, setScreen] = React.useState<Screens>("loading");

  function refundProfile() {
    let obj = {
      refTransId: "80001755520",
      amount: "10.00",
      cardNum: "0885",
      expDate: "XXXX",
    };

    axios({
      url: "http://localhost:1400/refundProfile",
      method: "POST",
      data: obj,
    })
      .then((res) => console.log("Refund Res: ", res.data))
      .catch((e) => console.error("Error refunding: ", e));
  }

  function chargeCard() {
    const payload = {
      cardNumber: "4242424242242",
    };
    axios({
      url: "http://localhost:1400/chargeCard",
      method: "POST",
      data: payload,
    })
      .then((res) => console.log("ChargeCard Res: ", res.data))
      .catch((e) => console.error("Error refunding: ", e));
  }

  React.useEffect(() => {
    if (status && cartIsDefined) {
      console.log("status");
      setScreen(undefined);
    }
  }, [status, cartIsDefined]);

  return (
    <>
      {screen === "loading" && (
        <div className={classes.screen}>
          <img src="https://i.gifer.com/XOsX.gif" width="350px" />
          <h2>Loading...</h2>
          {/* <img src="https://i.gifer.com/ZKZg.gif" width="50px" /> */}
        </div>
      )}
      {screen === "sending purchase" && (
        <div className={classes.screen}>
          <img src="https://i.gifer.com/7Q9s.gif" width="350px" />
          <h2>Hopefully your transaction goes through...</h2>
          <img src="https://i.gifer.com/ZKZg.gif" width="50px" />
        </div>
      )}
      {Array.isArray(screen) && (
        <div className={`${classes.screen} ${classes.success}`}>
          <img src="https://i.gifer.com/CGQ.gif" width="250px" />
          <h2>Your Order has been placed!</h2>
          <h3>Order #: {screen[1]}</h3>
          <p>
            Thank you! At ECigCity we greatly value our patrons as they keep our
            business alive.
          </p>
          <Link href="/">Return Home</Link>
        </div>
      )}

      <div className={classes.checkoutFlex}>
        <div
          style={{
            flex: "2 ",
          }}
        >
          <Cart
            setCartIsDefined={setCartIsDefined}
            setRefreshCart={setRefreshCart}
            invIssues={invIssues}
          />
          <Payment
            customerProfileId={customerProfileId}
            setCustomerProfileId={setCustomerProfileId}
            setPayment={setPayment}
            setGuestPayment={setGuestPayment}
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
            guestPayment={guestPayment}
            setInvIssues={setInvIssues}
            setScreen={setScreen}
          />
        </div>
      </div>
      <button onClick={() => signOut()}>Log out</button>
      <button onClick={chargeCard}>ChargeCard Hard-coded</button>
      <button onClick={() => console.log(getCartItems())}>
        Print cart items
      </button>
    </>
  );
}

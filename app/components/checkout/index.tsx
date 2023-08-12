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

export interface Payment {
  paymentProfileId: string;
  cardNumber: string;
  cardType: string;
  expDate: string;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const [customerProfileId, setCustomerProfileId] = React.useState<string>("");
  const [payment, setPayment] = React.useState<Payment | undefined>();
  const [refreshCart, setRefreshCart] = React.useState<boolean>(false);
  const [invIssues, setInvIssues] = React.useState<InvIssues[] | undefined>();
  const [cartIsDefined, setCartIsDefined] = React.useState<boolean>(false);
  const [screen, setScreen] = React.useState<
    "loading" | "purchase" | undefined
  >("loading");

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

  React.useEffect(() => {
    if (status && cartIsDefined) {
      console.log("status");
      setScreen(undefined);
    }
  }, [status, cartIsDefined]);

  return (
    <>
      {screen &&
        (screen === "loading" ? (
          <div className={classes.screen}>
            <img src="https://i.gifer.com/XOsX.gif" width="350px" />
            <h2>Loading...</h2>
            {/* <img src="https://i.gifer.com/ZKZg.gif" width="50px" /> */}
          </div>
        ) : (
          <div className={classes.screen}>
            <img src="https://i.gifer.com/7Q9s.gif" width="350px" />
            <h2>Hopefully your transaction goes through...</h2>
            <img src="https://i.gifer.com/ZKZg.gif" width="50px" />
          </div>
        ))}
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
            setScreen={setScreen}
          />
        </div>
      </div>
      <button onClick={() => signOut()}>Log out</button>
      <button onClick={refundProfile}>Refund Profile Hard-coded</button>
    </>
  );
}

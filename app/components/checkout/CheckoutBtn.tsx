"use client";
import React from "react";
import classes from "@/styles/Checkout.module.css";

export default function CheckoutBtn() {
  function completeCheckout() {
    console.log("should completing checkout...");
  }
  return (
    <div>
      <button onClick={completeCheckout}>Checkout Button</button>
    </div>
  );
}
